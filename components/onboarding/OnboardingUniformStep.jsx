import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ─────────────────────────────────────────────
// UNIFORM STEP  (API-integrated)
// ─────────────────────────────────────────────

const PRODUCTS_URL = `${process.env.EXPO_PUBLIC_API_BASE_URL}api/coachpro/uniform/products`;
const CHECKOUT_URL = `${process.env.EXPO_PUBLIC_API_BASE_URL}api/coachpro/uniform/checkout`;

const DISCOUNT_OPTIONS = [
  { value: "full",    label: "Full Discount (100% off)" },
  { value: "partial", label: "Partial Discount (COACH25)" },
  { value: "none",    label: "No Discount" },
];

const UniformStep = ({ onNext, onComplete, onBack, isCompleted, styles, COLORS, token }) => {
  // Products fetched from API
  const [products, setProducts] = useState([]);
  const [discountCode, setDiscountCode] = useState("COACH25");
  const [discountPct, setDiscountPct] = useState(25);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Per-product selected variant id  { [productId]: variantId }
  const [selected, setSelected] = useState({});
  const [activeItem, setActiveItem] = useState(null);

  // Discount type dropdown
  const [discountType, setDiscountType] = useState("none");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Checkout submission
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const [checkoutDiscountCode, setCheckoutDiscountCode] = useState(null);

  // ── Fetch products on mount ──────────────────
  const fetchProducts = async () => {
    setLoadingProducts(true);
    setFetchError(null);
    try {
      const headers = new Headers();
      headers.append("Authorization", `Bearer ${token}`);
      const res = await fetch(PRODUCTS_URL, { method: "GET", headers });
      const json = await res.json();
      // Response shape: { status, data: { collectionTitle, discountCode, discountPercentage, products: [...] } }
      if (json.status && json.data?.products) {
        setProducts(json.data.products);
        if (json.data.discountCode)       setDiscountCode(json.data.discountCode);
        if (json.data.discountPercentage) setDiscountPct(json.data.discountPercentage);
      } else {
        setFetchError(json.message || "Failed to load products.");
      }
    } catch (e) {
      console.error("Uniform products fetch:", e);
      setFetchError(e.message || "Network error. Please try again.");
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  // ── Helpers ──────────────────────────────────
  const toggleVariant = (productId, variantId) =>
    setSelected((prev) => ({
      ...prev,
      [productId]: prev[productId] === variantId ? undefined : variantId,
    }));

  /** Abbreviate size names: "Small" → "SM", "Medium" → "M", "X-Large" → "XL", etc. */
  const formatSize = (title = '') => {
    const map = {
      'extra small': 'XS', 'xsmall': 'XS', 'xs': 'XS',
      'small':       'S', 's':    'S',
      'medium':      'M',  'm':     'M',
      'large':       'L',  'l':     'L',
      'x-large':     'XL', 'xlarge': 'XL', 'xl': 'XL',
      'xx-large':    'XXL', 'xxlarge': 'XXL', 'xxl': 'XXL', '2xl': 'XXL',
      'xxx-large':   '3XL', 'xxxlarge': '3XL', 'xxxl': '3XL', '3xl': '3XL',
    };
    return map[title.toLowerCase().trim()] ?? title.toUpperCase();
  };

  // Items that have a variant chosen
  const selectedItems = Object.entries(selected)
    .filter(([, variantId]) => !!variantId)
    .map(([, variantId]) => ({ variantId }));

  // ── Checkout submission ──────────────────────
  const handleSubmit = async () => {
    if (selectedItems.length === 0) {
      setSubmitError("Please select at least one item before proceeding.");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    setSuccessMsg(null);
    try {
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Authorization", `Bearer ${token}`);
      const body = JSON.stringify({ items: selectedItems, discountType });
      const res = await fetch(CHECKOUT_URL, { method: "POST", headers, body });
      const json = await res.json();
      if (json.status && json.data?.checkoutUrl) {
        // Store the URL and discount code from response
        setCheckoutUrl(json.data.checkoutUrl);
        if (json.data.discountCode) setCheckoutDiscountCode(json.data.discountCode);
        setSuccessMsg(json.message || "Checkout URL created successfully.");
        // Open in-app browser immediately
        await WebBrowser.openBrowserAsync(json.data.checkoutUrl);
        // After browser closes → mark step complete
        if (onComplete) onComplete();
        else if (onNext) onNext();
      } else {
        setSubmitError(json.message || "Checkout failed. Please try again.");
      }
    } catch (e) {
      console.error("Uniform checkout:", e);
      setSubmitError(e.message || "Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ───────────────────────────────────
  return (
    <View style={styles.stepContainer}>
      {/* Header */}
      <View style={styles.contractHeader}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.contractHeaderTitle}>Purchase Uniform</Text>
        <View style={[styles.pendingBadge, isCompleted && { backgroundColor: COLORS.success }]}>
          <Text style={[styles.pendingBadgeText, isCompleted && { color: "#fff" }]}>
            {isCompleted ? "Completed" : "Pending"}
          </Text>
        </View>
      </View>

      {/* Top actions */}
      <View style={styles.contractBtnRow}>
        <TouchableOpacity style={styles.contractBtn} onPress={onBack}>
          <Text style={styles.contractBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>

      {/* Body */}
      {loadingProducts ? (
        <View style={uniformSt.centred}>
          <ActivityIndicator color={COLORS.primary} size="large" />
          <Text style={{ color: COLORS.textSecondary, marginTop: 10 }}>Loading products…</Text>
        </View>
      ) : fetchError ? (
        <View style={uniformSt.centred}>
          <View style={uniformSt.errorBox}>
            <Text style={uniformSt.errorText}>{fetchError}</Text>
          </View>
          <TouchableOpacity style={styles.contractBtn} onPress={fetchProducts}>
            <Text style={styles.contractBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1, padding: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.uniformNotice}>
            You must purchase mandatory items. Use discount code{' '}
            <Text style={uniformSt.discountCode}>{discountCode}</Text>
            {' '}at checkout to receive {discountPct}% off.
          </Text>

          {/* Discount type dropdown */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{
              fontSize: 12,
              fontFamily: 'Urbanist_600SemiBold',
              color: COLORS.textSecondary,
              textTransform: 'uppercase',
              letterSpacing: 0.6,
              marginBottom: 7,
            }}>
              Discount Type
            </Text>

            {/* Trigger button */}
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderWidth: 1,
                borderColor: COLORS.border,
                borderRadius: 10,
                paddingHorizontal: 14,
                paddingVertical: 12,
                backgroundColor: COLORS.surface,
              }}
              onPress={() => setDropdownOpen((o) => !o)}
              activeOpacity={0.8}
            >
              <Text style={{
                fontSize: 14,
                fontFamily: 'Urbanist_600SemiBold',
                color: COLORS.textPrimary,
              }}>
                {DISCOUNT_OPTIONS.find((o) => o.value === discountType)?.label}
              </Text>
              <Text style={{ fontSize: 10, color: COLORS.textSecondary }}>
                {dropdownOpen ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>

            {/* Options menu */}
            {dropdownOpen && (
              <View style={{
                marginTop: 4,
                borderWidth: 1,
                borderColor: COLORS.border,
                borderRadius: 10,
                overflow: 'hidden',
                backgroundColor: COLORS.surface,
              }}>
                {DISCOUNT_OPTIONS.map((opt, idx) => {
                  const isActive = discountType === opt.value;
                  return (
                    <TouchableOpacity
                      key={opt.value}
                      style={[
                        {
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingHorizontal: 14,
                          paddingVertical: 13,
                          backgroundColor: isActive
                            ? COLORS.primary + '18'
                            : 'transparent',
                        },
                        idx < DISCOUNT_OPTIONS.length - 1 && {
                          borderBottomWidth: 1,
                          borderBottomColor: COLORS.border,
                        },
                      ]}
                      onPress={() => { setDiscountType(opt.value); setDropdownOpen(false); }}
                      activeOpacity={0.7}
                    >
                      <Text style={{
                        fontSize: 14,
                        fontFamily: isActive ? 'Urbanist_700Bold' : 'Urbanist_500Medium',
                        color: isActive ? COLORS.primary : COLORS.textSecondary,
                      }}>
                        {opt.label}
                      </Text>
                      {isActive && (
                        <Text style={{
                          fontSize: 14,
                          color: COLORS.primary,
                          fontFamily: 'Urbanist_700Bold',
                        }}>✓</Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          {/* Product grid */}
          <View style={styles.uniformGrid}>
            {products.map((product) => {
              // API shape: product.image is a direct string URL
              const thumbUri = product.image || null;
              const variants = product.variants || [];
              const isExpanded = activeItem === product.id;
              // Show price of selected variant, or cheapest variant as default
              const selectedVariant = variants.find((v) => v.id === selected[product.id]);
              const cheapest = variants.reduce((min, v) =>
                parseFloat(v.price) < parseFloat(min.price) ? v : min,
                variants[0] || { price: "0", currency: "USD" }
              );
              const displayVariant = selectedVariant || cheapest;
              const displayPrice = displayVariant
                ? `${displayVariant.currency === "USD" ? "$" : "£"}${parseFloat(displayVariant.price).toFixed(2)}`
                : "";

              return (
                <TouchableOpacity
                  key={product.id}
                  style={styles.uniformGridItem}
                  onPress={() => setActiveItem(isExpanded ? null : product.id)}
                  activeOpacity={0.85}
                >
                  {thumbUri ? (
                    <Image source={{ uri: thumbUri }} style={styles.uniformGridImage} resizeMode="cover" />
                  ) : (
                    <View style={[styles.uniformGridImage, uniformSt.imagePlaceholder]} />
                  )}
                  <Text style={styles.uniformGridName}>{product.title}</Text>
                  <Text style={styles.uniformGridPrice}>{displayPrice}</Text>

              

                  {/* Variant selector — expands on tap */}
                  {isExpanded && variants.length > 0 && (
                    <View style={styles.sizeRow}>
                      {variants.map((v) => {
                        const isActive = selected[product.id] === v.id;
                        const unavailable = v.available === false;
                        return (
                          <TouchableOpacity
                            key={v.id}
                            style={[
                              styles.sizeBtn,
                              isActive && styles.sizeBtnActive,
                              unavailable && uniformSt.sizeBtnUnavailable,
                            ]}
                            onPress={() => !unavailable && toggleVariant(product.id, v.id)}
                            disabled={unavailable}
                          >
                            <Text style={[styles.sizeBtnText, isActive && styles.sizeBtnTextActive]}>
                              {formatSize(v.title)}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Error banner */}
          {submitError && (
            <View style={uniformSt.errorBox}>
              <Text style={uniformSt.errorText}>{submitError}</Text>
            </View>
          )}
          <View style={{ height: 20 }} />
        </ScrollView>
      )}

      {/* Footer */}
      {!loadingProducts && !fetchError && (
        <View style={styles.stepFooter}>
          {/* Primary action */}
          <TouchableOpacity
            style={[
              styles.primaryBtn,
              (submitting || isCompleted) && { opacity: 0.75 },
            ]}
            onPress={
              isCompleted
                ? () => { if (onComplete) onComplete(); else if (onNext) onNext(); }
                : handleSubmit
            }
            disabled={submitting}
            activeOpacity={0.85}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.primaryBtnText}>
                {isCompleted ? "Completed (Go Back)" : "Proceed to Checkout →"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// ── Local styles ─────────────────────────────
const uniformSt = StyleSheet.create({
  centred: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    padding: 20,
  },
  imagePlaceholder: {
    backgroundColor: "#2a2a2a",
  },
  selectedLabel: {
    fontSize: 11,
    color: "#22C55E",
    fontWeight: "600",
    marginTop: 2,
  },
  discountCode: {
    fontWeight: "800",
    color: "#E04F2A",
  },
  sizeBtnUnavailable: {
    opacity: 0.35,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    backgroundColor: "#FEF2F2",
    borderRadius: 6,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#EF4444",
    marginTop: 10,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 13,
    flex: 1,
  },
  successBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    backgroundColor: "#F0FFF4",
    borderRadius: 6,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#22C55E",
    marginTop: 10,
  },
  successText: {
    color: "#22C55E",
    fontSize: 13,
    flex: 1,
  },
});

export default UniformStep;
