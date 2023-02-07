import React, { useState } from 'react';
import Axios from 'axios';
import { authenticate } from '../../data/api';
import { BiEnvelope, BiUser } from "react-icons/bi";
import { BsFillLockFill } from "react-icons/bs";

import { getAuth, createUser} from "firebase/auth";

function Register() {
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState('admin');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    // const history = useHistory();

    async function register(e) {
        e.preventDefault();

        try {
            let nemail = email.toLowerCase().replace(/ /g,'');
           
            if (!firstname || !lastname || !nemail || !password || !confirmPassword) {
                setMessage("Please enter all fields");
                return;
            }

            if (password !== confirmPassword) {
                setMessage("Passwords do not match");
                return;
            }
            const registerData = { firstname, lastname, email:nemail, password, type};

            const response = await Axios.post(authenticate.addUser, registerData);
            
            if (response.data.success) {
                setFirstName('');
                setLastName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setType('admin');
                setMessage(response.data.msg + '.');
                setTimeout(() => {
                    setMessage("");
                }, 5000);
            }
        } catch (err) {
            setMessage(err.response.data.msg + '!');
            setTimeout(() => {
                setMessage("");
            }, 5000);
        }
    }

//     async function signingIn(){
//         try {
//             let nemail = email.toLowerCase().replace(/ /g,'');
            
//             if (!firstname || !lastname || !nemail || !password || !confirmPassword) {
//                 setMessage("Please enter all fields");
//                 return;
//             }
//             if (password !== confirmPassword) {
//                 setMessage("Passwords do not match");
//                 return;
//             }
//             await createUser(getAuth(), firstname, lastname, nemail, password, confirmPassword);
//             history.push("/admin/dashboard")
//     } catch (error){
//         setMessage(error.message);
//     }
// }

    return (
        <>
            <form className="sign-up-form" onSubmit={register}>
                <h2 className="title">Sign up</h2>
                <h4 style={{ color: 'red', textAlign: 'center' }}>{message}</h4>
                
                <div className="input-field">
                    <i><BiUser className="iconInput" /></i>
                    <input type="text" placeholder="First Name" onChange={(e) => setFirstName(e.target.value)} />
                </div>
                
                <div className="input-field">
                    <i><BiUser className="iconInput" /></i>
                    <input type="text" placeholder="Last Name" onChange={(e) => setLastName(e.target.value)} />
                </div>

                <div className="input-field">
                    <i><BiEnvelope className="iconInput" /></i>
                    <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="input-field">
                    <i><BsFillLockFill className="iconInput" /></i>
                    <input type="password" placeholder="Password" autoComplete='true' onChange={(e) => setPassword(e.target.value)} />
                </div>

                <div className="input-field">
                    <i><BsFillLockFill className="iconInput" /></i>
                    <input type="password" placeholder="Confirm Password"  onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>

                <input type="submit" className="btn-auth" value="Sign up" />
                
            </form>
        </>
    )
}

export default Register;
