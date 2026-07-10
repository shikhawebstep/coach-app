function VideoPlayerModal({ visible, item, onClose }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (visible) setIsLoading(true);
  }, [visible, item]);

  if (!item) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={playerSt.container}>
        <View style={playerSt.header}>
          <TouchableOpacity onPress={onClose} style={playerSt.closeBtn}>
            <Text style={playerSt.closeBtnText}>✕</Text>
          </TouchableOpacity>
          <Text style={playerSt.title} numberOfLines={1}>{item.title}</Text>
        </View>

        <View style={playerSt.mediaWrap}>
          {item.isVideo ? (
            <>
              <Video
                source={{ uri: item.url }}
                style={playerSt.video}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay
                onLoadStart={() => setIsLoading(true)}
                onLoad={() => setIsLoading(false)}
                onError={(e) => {
                  console.error('Video playback error:', e);
                  setIsLoading(false);
                }}
              />
              {isLoading && (
                <View style={playerSt.loadingOverlay}>
                  <ActivityIndicator size="large" color="#fff" />
                </View>
              )}
            </>
          ) : (
            <Image source={item.thumbnail} style={playerSt.video} resizeMode="contain" />
          )}
        </View>
      </View>
    </Modal>
  );
}

const playerSt = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 50, paddingBottom: 12, gap: 12,
  },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  closeBtnText: { color: '#fff', fontSize: 16 },
  title: { flex: 1, color: '#fff', fontSize: 16, fontWeight: '600' },
  mediaWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  video: { width: '100%', height: '100%' },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
});