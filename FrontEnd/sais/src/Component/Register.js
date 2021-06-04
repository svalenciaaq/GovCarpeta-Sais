import React, {Component} from "react";
import {
    Card, CardBody, CardText, Button
  } from 'reactstrap';
import { Form, FormGroup, Label, Input, FormFeedback, Alert  } from 'reactstrap';
import services from '../Services/services'


class Register extends Component {

    constructor(props){
        super(props);
        this.state = {
            password: "",
            confirmPassword: "",
            email: "",
            document: "",
            name: "",


            errorEmail: false,
            errorEmailExists: false,
            errorDocumentExists: false,
            errorConfirmPassword: false,
            errorDocument: false,
            errorUserRegistered: false,
            errorUserRegisteredWithUs: false,
            success: false,
            msgFromBack: null
        };

        this.changeInputValue = this.changeInputValue.bind(this);
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
    }

    changeInputValue(event){
        const target = event.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        let name = target.name;
    
        this.setState({
          [name]: value
        });
    }

    register(){
        const {password,confirmPassword, email, document, address, name} = this.state;

        let save = true;

        if(password !== confirmPassword){
            save = false;
            this.setState({errorConfirmPassword: true});
        }
        if(email === ""){
            save = false;
            this.setState({errorEmail: true});
        }
        if(name === ""){
            save = false;
            this.setState({errorName: true});
        }
        if(address === ""){
            save = false;
            this.setState({errorAddress: true});
        }

        if(save){
            this.setState({msgFromBack: null});
            this.setState({errorConfirmPassword: false, errorEmail: false, errorDocument: false});
            services.register(email, password, document, name, address).then(data => {
                if(data.code === 400){
                    if(data.msg.includes("email")){
                        this.setState({
                            errorEmailExists: true,
                            errorEmail: false
                        });
                    }
                    if(data.msg.includes("document")){
                        this.setState({
                            errorDocumentExists: true,
                            errorDocument: false
                        });
                    }
                    if(data.msg.includes("ERROR_USER_ON_ANOTHER_OPERATOR")){
                        this.setState({
                            errorUserRegistered: true
                        });
                    }
                    if(data.msg.includes("ERROR_USER_ALREADY_REGISTERED")){
                        this.setState({
                            errorUserRegisteredWithUs: true
                        });
                    }
                    if(data.msg.includes("Could not register")){
                        this.setState({
                            msgFromBack: data.msg
                        });
                    }
                }
                if(data.code === 200){
                    if(data.msg.includes("sucessfully")){
                        this.setState({
                            success: true
                        });
                    }
                }
            });
        }


    }


    login(){
        this.props.history.push("/login");    
    }
    

    render(){
        const {password,confirmPassword, errorDocumentExists, errorUserRegisteredWithUs,
            errorUserRegistered,name,errorName, address, errorAddress,
            errorEmailExists, email, document, errorConfirmPassword, success,errorEmail, errorDocument} = this.state;
        return(
            <div style={{
                display: "flex", 
                justifyContent:"center",
                alignItems:"center",
                minWidth:'400px',
                height:'700px',
                margin: 'auto'
            }}>
                <Card>
                    <CardBody>
                    <Form>
                        {success ? 
                            <Alert  color="success" fade={false}>
                                Usuario creado
                            </Alert >
                            : 
                            ""
                        }
                        {errorUserRegistered ? 
                            <Alert  color="danger" fade={false}>
                                Este numero de documento ya esta registrado en un operador
                            </Alert >
                            : 
                            ""
                        }
                        {errorUserRegisteredWithUs ? 
                            <Alert  color="danger" fade={false}>
                                Este numero de documento ya esta registrado con nosotros
                            </Alert >
                            : 
                            ""
                        }
                        <FormGroup className='mb-2'  id="formGroupDocumento">
                            
                            <Label for="registerDocument" className='mb-2' style={{minWidth: '400px'}}>Documento</Label>
                            <Input 
                                type="number" 
                                name="document" 
                                id="registerDocument" 
                                invalid={errorDocument || errorDocumentExists}  
                                placeholder="Ingrese el documento" 
                                value={document} 
                                onChange={(e) => {this.changeInputValue(e)}}>
                            {errorDocument ? 
                                <p style={{"color": "red", "marginLeft": "4px"}}>Numero de documento invalido. Intente de nuevo.</p>
                                : 
                                ""
                            }
                            {errorDocumentExists ? 
                                <p style={{"color": "red", "marginLeft": "4px"}}>El numero de documento ya esta registrado</p>
                                : 
                                ""
                            }
                            </Input>
                        </FormGroup>
                        <FormGroup className='mb-2' id="formGroupCorreo">
                            <Label for="registerEmail" className='mb-2'>Correo</Label>
                            <Input 
                                type="email" 
                                name="email" 
                                id="registerEmail" 
                                placeholder="Ingrese un correo" 
                                invalid={errorEmail || errorEmailExists} 
                                value={email} 
                                onChange={(e) => {this.changeInputValue(e)}} >
                            </Input>
                            {errorEmail ? 
                                <p style={{"color": "red", "marginLeft": "4px"}}>Ingresa un correo valido</p>
                                : 
                                ""
                            }
                            {errorEmailExists ? 
                                <p style={{"color": "red", "marginLeft": "4px"}}>Este correo ya esta registrado</p>
                                : 
                                ""
                            }
                        </FormGroup>
                        
                        <FormGroup className='mb-2' id="formGroupNombre">
                            <Label for="registerName" className='mb-2'>Nombre</Label>
                            <Input 
                                type="text" 
                                name="name" 
                                id="registerName" 
                                placeholder="Ingrese su nombre" 
                                invalid={errorName} 
                                value={name} 
                                onChange={(e) => {this.changeInputValue(e)}} >
                            </Input>
                            {errorName ? 
                                <p style={{"color": "red", "marginLeft": "4px"}}>Ingresa un nombre valido</p>
                                : 
                                ""
                            }
                        </FormGroup>
                        
                        <FormGroup className='mb-2' id="formGroupDireccion">
                            <Label for="registerAddress" className='mb-2'>Direccion</Label>
                            <Input 
                                type="text" 
                                name="address" 
                                id="registerAddress" 
                                placeholder="Ingrese una direccion" 
                                invalid={errorAddress} 
                                value={address} 
                                onChange={(e) => {this.changeInputValue(e)}} >
                            </Input>
                            {errorAddress ? 
                                <p style={{"color": "red", "marginLeft": "4px"}}>Ingresa una direccion valida</p>
                                : 
                                ""
                            }
                        </FormGroup>
                        <FormGroup className='mb-2' id="formGroupContraseña">
                            <Label for="registerPassword" className='mb-2'>Contraseña</Label>
                            <Input 
                                type="password" 
                                name="password" 
                                id="registerPassword" 
                                value={password} 
                                onChange={(e) => {this.changeInputValue(e)}}/>
                        </FormGroup>
                        <FormGroup className='mb-2'>
                            <Label for="confirmRegisterPassword" className='mb-2'>Confirmar Contraseña</Label>
                            <Input 
                                type="password" 
                                name="confirmPassword"
                                value={confirmPassword}
                                invalid={errorConfirmPassword} 
                                id="confirmRegisterPassword"
                                onChange={(e) => {this.changeInputValue(e)}}/>
                            {errorConfirmPassword ? 
                                <p style={{"color": "red", "marginLeft": "4px"}}>Las contraseñas no coinciden</p>
                                : 
                                ""
                            } 
                        </FormGroup>
                    </Form>
                        <Button color="warning" onClick={this.register} type="submit" className='mt-4' style={{width: '100%'}}>Registrar</Button>
                        <Button color="orange" onClick={this.login} className='mt-4' style={{width: '100%'}}>Ya tiene cuenta ? inicie sesion</Button>
                    </CardBody>
                </Card>
            </div>
        );
    }

}

export default Register;