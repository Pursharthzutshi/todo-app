// styles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  appContainer: { flex: 1, backgroundColor: '#fff' },

  innerContainer: { flex: 1, padding: 16, marginTop:10},
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  menuButton: { padding: 8 , marginTop:48},
  hamburger: { width: 22, justifyContent: 'center' },
  hamburgerLine: { height: 2, marginVertical: 2, backgroundColor: '#222' },
  searchButton: { padding: 8 },
  searchIcon: { fontSize: 18 },

  titleSection: { marginBottom: 12 },
  mainTitle: { fontSize: 28, fontWeight: '700' },
  dateText: { color: '#666', marginTop: 4 },

  filterContainer: { flexDirection: 'row', marginVertical: 12 },
  filterButton: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 14, marginRight: 8, backgroundColor: '#f0f0f0' },
  activeFilter: { backgroundColor: '#222' },
  filterText: { color: '#333' },
  activeFilterText: { color: '#fff' },

  addTaskContainer: { flexDirection: 'column',marginTop:12, marginBottom: 22, gap:20 },
  addTaskButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#222', marginRight: 8 },
  addTaskIcon: { color: '#fff', fontSize: 22 },
  addTaskInput: {  borderRadius: 8, borderWidth: 1, height:50, borderColor: '#e0e0e0', paddingHorizontal: 15 },

  todoInput: { height: 44, borderRadius: 8, borderWidth: 1, borderColor: '#e0e0e0', paddingHorizontal: 10 },

  taskList: { flex: 1},

  taskCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 8, backgroundColor: '#fafafa', marginBottom: 10 },
  checkbox: { width: 28, height: 28, borderRadius: 6, borderWidth: 1, borderColor: '#ccc', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  checkedBox: { backgroundColor: '#222', borderColor: '#222' },
  checkmark: { color: '#fff', fontWeight: '700' },

  taskContent: { flex: 1 },
  taskTitle: { fontSize: 16 },
  completedTask: { textDecorationLine: 'line-through', color: '#999' },
  taskDetails: { color: '#777', marginTop: 4 },

  taskActions: { marginLeft: 8, justifyContent: 'center', alignItems: 'center' },
  starIcon: { fontSize: 18 },

  fab: { position: 'absolute', right: 18, bottom: 22, width: 56, height: 56, borderRadius: 28, backgroundColor: '#222', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  fabIcon: { color: '#fff', fontSize: 26 },

  FooterNavigationBar: { marginBottom: 50, height: 60, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, backgroundColor: 'black', color:"white" },
  navButton: { padding: 10 },
  activeNavButton: { borderTopWidth: 2, borderTopColor: '#222' },
  navText: { color: 'white' },
  activeNavText: { color: 'white',borderBlockColor:"white"},

  headerTitle: { fontSize: 18, fontWeight: '600' },
  moreButton: { padding: 8 },
  moreIcon: { fontSize: 20 },

  backButton: { padding: 8 },
  backIcon: { fontSize: 18 },

  searchContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 10, paddingHorizontal: 8 },
  searchInput: { flex: 1, height: 40, borderRadius: 8, borderWidth: 1, borderColor: '#e0e0e0', paddingHorizontal: 10 },

  searchTodoInput: { borderColor:"black",marginTop:12, borderWidth:2, borderRadius:8, height:40, paddingHorizontal:10},

  // Progress Page 
// shadowOffset: { width: 0.5, height: 0.1 },
  progressBarBox: {display:"flex",flexDirection:"row", borderWidth:.1 , height:190, backgroundColor:"white", borderRadius:16, marginTop:20, justifyContent:"space-evenly", alignItems:"center"},

  totalTasksCompleteBox: {display:"flex" , padding: 3, flexDirection:"row" , backgroundColor:"white", borderRadius:16, marginTop:20},

  totalTasksCompleteBoxTitle: {color:"black", fontWeight:"900", fontSize:28, padding:18},

  tasksCompletionInformationParentBox: {display:"flex",  borderWidth:.1,flexDirection:"row" , height:180, backgroundColor:"white", borderRadius:16, marginTop:20, justifyContent:"space-evenly", alignItems:"center"},

  tasksCompletionInformationBox: { padding:9, width:98, borderColor:"grey" ,backgroundColor: "white", borderWidth:2, borderColor:"black", borderDashed: "dashed", display:"flex",flexDirection:"column",alignItems:"center" , textAlign:"center"},

  bottomBarBoxes:{ padding:13, width:120, height:80, borderColor:"grey" ,backgroundColor: "black", borderColor:"black", borderRadius:16, display:"flex",flexDirection:"row",alignItems:"center" , justifyContent:"center"}

});
