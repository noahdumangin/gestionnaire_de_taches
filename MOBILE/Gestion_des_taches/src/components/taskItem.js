import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { deleteTask } from "../api/taskApi";

function statusColor(status) {
  switch (status) {
    case "done":
      return 'rgba(5, 255, 100, 0.51)';
    case "in_progress":
      return 'rgba(5, 100, 255, 0.51)';
    case "todo":
      return 'rgba(151, 157, 164, 0.51)';
  }
}

function timeAgo(isoDate) {
  if (!isoDate) { return ""; }
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) {
    return mins + "m";
  }
  const hours = Math.floor(mins / 60);
  if (hours < 24) {
    return hours + "h";
  }
  const days = Math.floor(hours / 24);
  return days + "d";
}

export default function TaskItem({ task, onPress }) {
  const bg = statusColor(task.status);

  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, [opacity]);

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => onPress && onPress(task)}>
      <Animated.View style={[styles.container, { backgroundColor: bg, opacity }]}> 
        <View style={styles.content}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
            {task.title}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.statusText}>{task.status.replace("_", " ")}</Text>
            <Text>   </Text>
            <Text style={styles.time}>{timeAgo(task.createdAt)}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.headerAddButton} onPress={async () => {
          const ok = await deleteTask(task._id);
          if (ok) {
            await fetchTask();
          } else {
            console.warn('the task was not successfully deleted');
          }
        }}>
          <Text style={styles.headerAddText}>Supprimer</Text>
        </TouchableOpacity>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    width: '50rem',
    alignSelf: 'center',
    minHeight: 64,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
  },

  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 15,
    color: "#000000ff",
    textTransform: "capitalize",
  },
  time: { 
    fontSize: 14, color: "#000000ff" 
  },
  headerAddButton: { marginTop: 8, backgroundColor: '#ff0000ff', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  headerAddText: { color: '#fff', fontWeight: '600' }
});
