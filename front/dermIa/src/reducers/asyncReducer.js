// Create a reducer to control asynchronous data retrieval
export function createAsyncReducer(initialData) {
  const asyncReducer = (state, action) => {
    switch (action.type) {
      case "FETCH_START":
        return { ...state, loading: true, error: null };
      case "FETCH_SUCCESS":
        return { loading: false, data: action.payload, error: null };
      case "FETCH_ERROR":
        return { loading: false, data: initialData, error: action.payload };
      default:
        return state;
    }
  };

  const initialState = {
    loading: true,
    data: initialData,
    error: null,
  };

  return {
    asyncReducer,
    initialState,
  };
}