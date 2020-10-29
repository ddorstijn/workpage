import { ref } from 'vue'

interface Item {
  id: number
  title: string
  details: object
}

interface List {
  title: string
  items: Item[]
}

export default function useLists(startLists: List[]) {
  const uid = ref(0)
  const lists = ref(startLists)

  const addItem = (list: List, item: Item, prepend?: boolean) => {
    if (!item) {
      item = {
        id: uid.value++,
        title: '',
        details: null,
      }
    }

    if (item.id === -1) {
      item.id = uid.value++
    }

    if (prepend) {
      list.items.unshift(item)
    } else {
      list.items.push(item)
    }
  }

  const removeItem = (list: List, item: Item) => {
    const index = list.items.indexOf(item)
    if (index > -1) {
      list.items.splice(index, 1)
    }
  }

  const addList = (title: String, items: Item[] = []) => {
    const list = {
      title: title,
      items: items,
    } as List

    lists.value.push(list)
  }

  const removeList = (list: List) => {
    const index = lists.value.indexOf(list)
    if (index > -1) {
      lists.value.splice(index, 1)
    }
  }

  return {
    uid,
    lists,
    addItem,
    removeItem,
    addList,
    removeList,
  }
}
