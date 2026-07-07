import { Image, Text, TouchableOpacity, View } from "react-native";

// ─────────────────────────────────────────────
// TASK LIST COMPONENT
// ─────────────────────────────────────────────

const TaskList = ({ tasks, completedTasks = {}, currentTaskIndex, onSelect, styles }) => (
  <View style={styles.taskList}>
    {tasks.map((task, i) => {
      const isDone = !!completedTasks[task.id];
      const isActive = i === currentTaskIndex;
      return (
        <TouchableOpacity
          key={task.id}
          style={[styles.taskItem, isActive && styles.taskItemActive]}
          onPress={() => onSelect(i)}
          activeOpacity={0.75}
        >
          <View style={[styles.taskIconWrap, isDone && styles.taskIconDone, isActive && styles.taskIconActive]}>
            {isDone ? (
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>✓</Text>
            ) : (
              <Image source={task.icon} style={styles.taskIcon} />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.taskTitle, isActive && styles.taskTitleActive]}>{task.title}</Text>
            <Text style={styles.taskSub}>{task.subtitle}</Text>
          </View>
          <View style={[styles.taskBadge, isDone ? styles.taskBadgeDone : isActive ? styles.taskBadgeActive : styles.taskBadgePending]}>
            <Text style={styles.taskBadgeText}>{isDone ? "Done" : isActive ? "Now" : "Pending"}</Text>
          </View>
        </TouchableOpacity>
      );
    })}
  </View>
);

export default TaskList;
