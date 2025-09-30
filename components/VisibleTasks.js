// components/VisibleTasks.js

export default function getVisibleTasks(filteredTasks = [], searchAllTodoListItem = '') {
  const query = (searchAllTodoListItem || '').trim().toLowerCase();

  if (!query) return filteredTasks;

  return filteredTasks.filter(task => {
    const t = (task?.title || '').toLowerCase();
    return t.includes(query);
  });
}
