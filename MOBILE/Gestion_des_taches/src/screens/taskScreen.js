// src/screens/TasksScreen.js
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  FlatList,
  Text,
  SafeAreaView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Modal,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { getTask, simulateTasks, createTask} from "../api/taskApi";
import TaskItem from "../components/taskItem";

export default function TaskScreen() {
  const [tasks, setTasks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const simulateCount = useRef(0);
  const simulatedTasksRef = useRef([]);
  const lastIdsRef = useRef("");
  const lastServerCreatedAtRef = useRef(null);
  const isFetchingRef = useRef(false);
  const controllerRef = useRef(null);

  const fetchTask = useCallback(async () => {
  try {
    const serverData = await getTask();
    setTasks(serverData || []);
  } catch (err) {
    console.warn("Failed to load tasks", err);
  }
}, []);
  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      try { UIManager.setLayoutAnimationEnabledExperimental(true); } catch (e) {}
    }

    fetchTask();
  }, [fetchTask]);

  useEffect(() => {
    const id = setInterval(fetchTask, 5000);
    return () => clearInterval(id);
  }, [fetchTask]);

  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        try { controllerRef.current.abort(); } catch (e) {}
      }
    };
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTask();
    setRefreshing(false);
  }, [fetchTask]);

  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newStatus, setNewStatus] = useState("todo");
  const submitNewTask = async () => {
    const title = newTitle.trim();
    if (!title) return;
    setNewTitle("");
    setNewStatus("todo");
    setShowAdd(false);

    try {
      const createdTask = await createTask({ title, status: newStatus });
      if (createdTask) {
        await fetchTask();
      }
    } catch (err) {
      console.warn("Erreur création tâche", err);
    }
  };


  const renderEmpty = () => (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>Aucune tâche</Text>
      <Text style={styles.emptySubtitle}>Ajoutez une nouvelle tâche pour commencer.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes tâches</Text>
        <TouchableOpacity style={styles.headerAddButton} onPress={() => setShowAdd(true)}>
          <Text style={styles.headerAddText}>Ajouter une tâche</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.headerAddButton, styles.headerSimulateButton]}
          onPress={async () => {
            const ok = await simulateTasks();
            if (ok) {
              await fetchTask();
            } else {
              console.warn('simulation request failed');
            }
          }}
        >
          <Text style={styles.headerAddText}>Simuler 10 tâches</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <TaskItem task={item} />}
        contentContainerStyle={tasks.length ? styles.listContainer : styles.listEmpty}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={renderEmpty}
      />
      
      <Modal visible={showAdd} animationType="slide" transparent>
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter une tâche</Text>
            <TextInput
              placeholder="Titre"
              value={newTitle}
              onChangeText={setNewTitle}
              style={styles.input}
            />

            <View style={styles.statusRow}>
              {['todo','in_progress','done'].map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.statusButton, newStatus === s && styles.statusButtonActive]}
                  onPress={() => setNewStatus(s)}>
                  <Text style={styles.statusButtonText}>{s.replace('_',' ')}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAdd(false)}>
                <Text style={styles.cancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={submitNewTask}>
                <Text style={styles.saveText}>Ajouter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F1F5F9" },
  header: {
    paddingTop: 16,
    paddingBottom: 8,
    alignItems: "center",
  },
  headerTitle: { fontSize: 28, fontWeight: "700", color: "#000000ff", textAlign: "center" },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  headerAddButton: { marginTop: 8, backgroundColor: '#2563EB', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  headerAddText: { color: '#fff', fontWeight: '600' },
  headerSimulateButton: { backgroundColor: '#10b981df' },
  listContainer: { paddingBottom: 140, alignItems: "center" },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    // shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    maxWidth: 550,
    alignSelf: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#cad0d6ff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  statusRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  statusButtonActive: { backgroundColor: '#e6f0ff', borderColor: '#93c5fd' },
  statusButtonText: { textTransform: 'capitalize' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  cancelButton: { backgroundColor: '#eb2525ff', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8},
  cancelText: { color: '#fff', fontWeight: '700' },
  saveButton: { backgroundColor: '#2563EB', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  saveText: { color: '#fff', fontWeight: '700' },
  empty: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#5c6b7f",
    textAlign: "center",
  },
});