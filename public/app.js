import DragAndDropManager from "./src/dragAndDropManager.js";
import ConnectionManager from "./src/connectionManager.js";
import AppController from "./src/appController.js";
import ViewManager from "./src/viewManager.js";

const API_URL = "https://localhost:3000";

const connectionManager = new ConnectionManager({apiUrl: API_URL});
const dragAndDropManager = new DragAndDropManager();
const viewManager = new ViewManager(connectionManager);


const appController = new AppController({connectionManager, viewManager, dragAndDropManager});


try {
  await appController.initialize();
  
} catch (error) {
  console.error("Error on initializing!",error);
} 