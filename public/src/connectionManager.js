export default class ConnectionManager{
  constructor({apiUrl}){
    this.apiUrl = apiUrl;
    
    this.ioClient = io.connect(apiUrl, {withCredentials:false});
    this.socketId = null;
  }

  onConnect(msg){
    console.log("connect", this.ioClient.id);
    this.socketId = this.ioClient.id;

  }

  configureEvents({onProgress}){
    this.ioClient.on("connect", this.onConnect.bind(this));
    this.ioClient.on("file-upload", onProgress);
  }

  async uploadFile(file){
    const formData = new FormData();
    formData.append("files", file);

    const response = await fetch(`${this.apiUrl}?socketId=${this.socketId}`, {
      method:"POST",
      body:formData
    });
    
    return response.json();
  }
  
  downloadFile(fileName){
    window.location.href =  `${this.apiUrl}/download?file=${fileName}`;
  }
  
  async currentFiles(){
    const response = await fetch(this.apiUrl);
    const data = await response.json();

    return data;
  }
}