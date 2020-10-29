import { ref } from 'vue'

interface Item {
  id: number
  title: string
  details: object
}

export default function useLists() {
  const uid = ref(0)

  const addItem = (list: List, item: Item) => {
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

    list.push(item)
  }

  const removeItem = (list: List, item: Item) => {
    const index = list.indexOf(item)
    if (index > -1) {
      list.splice(index, 1)
    }
  }

  return {
    uid,
    addItem,
    removeItem,
  }
}
