import React, {Component} from "react";
import { Form, CardBody, Card, Input, Button, Alert  } from 'reactstrap';
import { services } from "../Services";
import { Table, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import DragAndDrop from "./DragAndDrop";


class Homepage extends Component {

    constructor(props){
        super(props);
        this.state = {
            content: [],
            uploadmsg: "",
            selectedFiles: [],
            uploadFile: false,
            fileTitle: ""
        };
        this.logoff = this.logoff.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
        this.onChangeFileHandler = this.onChangeFileHandler.bind(this);
        this.checkDuplicates = this.checkDuplicates.bind(this);
        this.uploadFile =  this.uploadFile.bind(this);
        this.onChangeFileTitle =  this.onChangeFileTitle.bind(this);
        this.toggle = this.toggle.bind(this);
        this.getFileList = this.getFileList.bind(this);
    }

    
    toggle(){
        const {uploadFile} = this.state;
        this.setState({
            uploadFile: !uploadFile,
            selectedFiles: [],
            errorFileSelected: false,
            errorFileTitle: false,
            uploadmsg: "",
        })
    }

    handleDrop = (files) => {
        let fileList = this.state.selectedFiles;
        let filesArray = Array.from(files);
        for (let key in filesArray) {
            if (this.checkDuplicates(filesArray[key], fileList)) {
                fileList.push(filesArray[key]);
            }
        }
        this.setState({
            selectedFiles: fileList,
        })
    };

    onChangeFileTitle(event){
        const target = event.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        let name = target.name;
    
        this.setState({
          [name]: value
        });
    }

    onChangeFileHandler = event => {
        let files = event.target.files;
        let fileList = this.state.selectedFiles;
        let message = [];
        let filesArray = Array.from(files);
        for (let key in filesArray) {
          if (this.checkDuplicates(filesArray[key], fileList)) {
            fileList.push(filesArray[key]);
            message.push("");
          }
        }
        this.setState({
          selectedFiles: fileList,
          message: message
        })
    };

    checkDuplicates(file, fileList) {
        for (let x = 0; x < fileList.length; x++) {
            if (fileList[x].name === file.name) {
                this.setState({
                    generalError: "Some duplicate files could not be accepted."
                });
                setTimeout(this.cleanGeneralError, 4000);
                return false;
            }
        }
        return true;
    }

    logoff(){
        sessionStorage.removeItem("jwt");
        this.props.history.push("/login");
    }

    uploadFile(){
        let {selectedFiles, fileTitle} = this.state;
        let upload = true;
        if(!selectedFiles || !selectedFiles[0]){
            upload = false
            this.setState({
                errorFileSelected: true
            })
        }else{this.setState({ errorFileSelected: false })}
        if(!fileTitle || fileTitle === ""){
            upload = false
            this.setState({
                errorFileTitle: true
            })
        }else{this.setState({ errorFileTitle: false })}

        if (upload) {
            services.uploadFile(selectedFiles[0].name, selectedFiles[0], fileTitle).then(data => {
                if (data.code === 200) {
                    this.setState({
                        errorFileTitle: false,
                        errorFileSelected: false,
                        uploadmsg: <p className={'text-success mt-5'}>{data.msg}</p>
                    })
                }else{
                    this.setState({
                        errorFileTitle: false,
                        errorFileSelected: false,
                        uploadmsg: <p className={'text-danger mt-5'}>{data.msg}</p>
                    })
                }
                this.getFileList();
            });    
        }
    }

    getFileList(){
        services.getFileList().then(data => {
            if(data.content){
                this.setState({content: data.content});
            }
        });
    }

    componentDidMount(){
        var jwt = sessionStorage.getItem('jwt');
        if(!jwt){
            this.props.history.push("/login");
        }else{
            this.getFileList();
        }
    }

    render(){
        const {content, uploadFile, uploadmsg, selectedFiles, errorFileTitle, errorFileSelected} = this.state;
        let fileList = [];
        let tableContent = [];
        
        for(let key in content){
            let filename = content[key];    
            let fileParts = filename.split("/");
            if (fileParts && fileParts[1]) {
                tableContent.push(
                    <tr>
                        <th scope="row">{fileParts[1]}</th>
                    </tr>
                );                  
            }
        }

        if (selectedFiles.length > 0) {
            for (let key in selectedFiles) {
                fileList.push(
                    <li className="form-control list-group-item" style={{display: '-webkit-inline-box'}} key={key}>
                        <p>{selectedFiles[key].name}</p>
                    </li>
                );
            }
          }

        return(
            <div>
                <div>
                    <Button color="danger" className={"m-4"} onClick={this.logoff}>Log off</Button>
                </div>
                <div style={{
                    display: "block", 
                    justifyContent:"center",
                    alignItems:"center",
                    minWidth:'400px',
                    maxHeight:'700px',
                    height:'700px',
                    margin: '90px',
                }} className="mt-auto">
                    <Card>
                        <CardBody>
                        {content.length > 0 ?
                            <Table responsive={true}>
                                <thead>
                                    <tr>
                                        <th>Filename</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableContent}
                                </tbody>
                            </Table>
                        : 
                        <div className="mt-5 mb-5 text-center">
                            <h4>No results found for your document. Try to upload something!</h4>
                        </div>
                        }
                            <Button color="warning" onClick={this.toggle} type="submit" className='mt-4' style={{width: '100%'}}>Upload File</Button>
                        </CardBody>
                    </Card>
                </div>
                <Modal isOpen={uploadFile} toggle={this.toggle}>
                <DragAndDrop handleDrop={this.handleDrop}>
                    <ModalHeader toggle={this.toggle}>Upload file</ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            {errorFileTitle ? 
                                <Alert  color="danger" fade={false}>
                                    Necesita ingresar un titulo de documento para continuar
                                </Alert >
                                : 
                                ""
                            }
                            {errorFileSelected ? 
                                <Alert  color="danger" fade={false}>
                                    Necesita seleccionar un archivo para continuar
                                </Alert >
                                : 
                                ""
                            }
                            <div className="col">
                                <label htmlFor="files" className="btn btn-block btn-dark w-100">Choose your file(s) </label>
                                <input type="text" name="fileTitle" className="form-control mt-2" placeholder="Titulo del documento"
                                    onChange={this.onChangeFileTitle}/>
                                <input type="file" id="files" hidden={true} className="form-control"
                                    onChange={this.onChangeFileHandler}/>
                            </div>
                            <div className="offset-md-3 col-md-6 text-center">
                                {uploadmsg}
                            </div>
                            {selectedFiles && selectedFiles.length > 0 ?
                                <div className="card col-12 mt-5 mb-5">
                                    <div className="card-header">Files</div>
                                    <ul className="list-group list-group-flush">
                                    {fileList}
                                    </ul>
                                </div> : ""}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.uploadFile}>Upload</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                    </DragAndDrop>
                </Modal>
            </div>
        );
    }

}

export default Homepage;