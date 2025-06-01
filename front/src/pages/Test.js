const x = { id: 1, name: "Shirt", category: { id: "a", name: "Men" } };

let z = { m: "abdo" };
z["m"] = "hello";
z["m"] = "hello";
z["m"] = "hello";
z["x"] = "hello";
console.log(z, "zzzzzzzzzzz");

function tester(key, value) {
  return { ...x, [key]: value };
}

const normalized = {
  items: {
    byId: {
      1: { id: 1, name: "Shirt", category: { id: "a", name: "Men" } },
      2: { id: 2, name: "Dress", category: { id: "b", name: "Women" } },
      3: { id: 3, name: "Dress", category: { id: "b", name: "Women" } },
    },
    allIds: [1, 2, 3],
  },

  cars: {},
};

const action = { type: "DELETE_ITEM", id: 1 };
function deleteItem(state, id) {
  const newById = Object.fromEntries(
    Object.entries(state.items.byId).filter(([key]) => key !== String(id))
  );

  const newAllIds = state.items.allIds.filter((itemId) => itemId !== id);

  const newItems = {
    ...state.items,
    byId: newById,
    allIds: newAllIds,
  };

  return {
    ...state,
    items: newItems,
  };
}

function add(state, newItem) {
  const newAllIds = [...state.items.allIds, newItem.id];
  const newById = {
    ...state.items.byId,
    [newItem.id]: newItem,
  };
  const newItems = { ...state.items, byId: newById, allIds: newAllIds };
  return { ...state, items: newItems };
}

function update(state, id, payload) {}

console.log(
  "ADD",
  add(normalized, {
    id: 100,
    name: "XXSXXhirt",
    category: { id: "aXX", name: "MenXX" },
  })
);

function Test() {
  const x = normalized.items.allIds.map(
    (index) => normalized.items.byId[index]
  );
  // switch (action.type) {
  //   case "DELETE_ITEM":
  //     deleteItem(normalized, action.id);
  //     break;
  //   case "ADD_ITEM":

  //   default:
  // }
  console.log(x);
}

export default Test;
