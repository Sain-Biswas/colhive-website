import { createStore } from "@xstate/store";

// Create a store
const projectStyleStore = createStore({
  context: { style: "grid" },
  on: {
    showAsGrid: () => ({
      style: "grid",
    }),
    showAsList: () => ({
      style: "list",
    }),
  },
});

export default projectStyleStore;
