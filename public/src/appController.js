
export default class AppController{
  constructor({connectionManager, viewManager, dragAndDropManager}){
    this.dragAndDropManager = dragAndDropManager;
    this.connectionManager = connectionManager;
    this.viewManager = viewManager;
    this.uploadingFiles = new Map();
  }

  async initialize(){
    this.viewManager.configureButtonClick();
    this.viewManager.configureModal();
    this.viewManager.configureOnFileChange(this.onFileChange.bind(this));
    this.connectionManager.configureEvents({
      onProgress: this.onProgress.bind(this)
    });
    this.viewManager.updateStatus(0);
    this.dragAndDropManager.initialize({
      onDropHandler: this.onFileChange.bind(this)
    });
    
    await this.updateCurrentFiles();
    
    this.viewManager.configureDownloadButtons();
  } 

  async onProgress({processedAlready, filename}){
    const file = this.uploadingFiles.get(filename);

    const processedAlreadyPercent = Math.ceil(processedAlready / file.size * 100);

    this.updateProgress(file, processedAlreadyPercent);

    if( processedAlreadyPercent < 98) return;

    return this.updateCurrentFiles();
  }

  updateProgress(file, percent){
    const uploadingFiles = this.uploadingFiles;
    file.percent = percent;

    const total = [...uploadingFiles.values()]
      .map( ({percent}) => percent ?? 0)
      .reduce( (total, current) => total + current, 0);

    this.viewManager.updateStatus(total);
  }
  
  async onFileChange(files){
    this.uploadingFiles.clear();
    this.viewManager.openModal();
    this.viewManager.updateStatus(0);
    
    const requests = [];

    for (const file of files){
      this.uploadingFiles.set(file.name, file);
      requests.push(this.connectionManager.uploadFile(file));
    }
    
    await Promise.all(requests);
    this.viewManager.updateStatus(100);

    setTimeout( () => this.viewManager.closeModal(), 1000);

    this.updateCurrentFiles();
  }

  async updateCurrentFiles(){
    const files = await this.connectionManager.currentFiles();

    this.viewManager.updateCurrentFiles(files);
  }
}