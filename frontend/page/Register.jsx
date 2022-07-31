import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { useCanister } from '@connect2ic/react'
import { useForm } from "react-hook-form";

const Register = (props) => {
    const [customer] = useCanister("customer")
    const { principal } = props
    // let navigate = useNavigate();
    const { register, handleSubmit } = useForm();
    const [data, setData] = useState("");
    // useEffect(() => {
    //     if (principal != null) {
    //         navigate("/home")
    //     }
    // }, [principal])
    useEffect(() => {
        console.log(data);
    }, [data])
    async function handle(data) {
        console.log(data);
        const length = Math.floor(Math.random() * 10);
        const obj = {
            ID: length,
            Sex: String(data.sex),
            Name: String(data.firstName + data.lastName),
            Phone: String(data.phone),
            Birthday: String(data.dateOfBirth)
        }
        // const obj = {
        //     ID: length,
        //     Sex: "male",
        //     Name: "asdkjsadk",
        //     Phone: "03033",
        //     Birthday: "21-2-2002"
        // }
        const result = await customer.createAccount(obj)
        console.log(result);
    }
    return (
        <div className="container-fluid">
            <h4 className="d-flex flex-row-reverse">canister id</h4>
            <h2 className="d-flex align-items-center justify-content-center">Register</h2>
            <div className="d-flex align-items-center justify-content-center">
                <form onSubmit={handleSubmit(handle)}>
                    <div className="row g-3 align-items-center">
                        <div className="col-auto">
                            <label htmlFor="firstName" className="col-form-label"
                            >First Name</label>
                        </div>
                        <div className="col-auto">
                            <input
                                {...register("firstName")}
                                type="text"
                                id="firstName"
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="row g-3 align-items-center">
                        <div className="col-auto">
                            <label htmlFor="lastName" className="col-form-label"
                            >Last Name</label>
                        </div>
                        <div className="col-auto">
                            <input
                                type="text"
                                {...register("lastName")}
                                id="lastName"
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="row g-3 align-items-center">
                        <div className="col-auto">
                            <label className="col-form-label">Sex</label>
                        </div>
                        <div className="col-auto">
                            <label htmlFor="male">Male</label>
                            <input type="radio" name="sex"
                                {...register("sex")} value="male" id="male" />
                            <label htmlFor="female" >Female</label>
                            <input type="radio" name="sex" value="female" id="female"
                                {...register("sex")} />
                        </div>
                    </div>

                    <div className="row g-3 align-items-center">
                        <div className="col-auto">
                            <label htmlFor="dateOfBirth" className="col-form-label"
                            >Date of Birth</label>
                        </div>
                        <div className="col-auto">
                            <input
                                {...register("birthday")}
                                type="date"
                                id="dateOfBirth"
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="row g-3 align-items-center">
                        <div className="col-auto">
                            <label htmlFor="phone" className="col-form-label">Phone</label>
                        </div>
                        <div className="col-auto">
                            <input
                                type="text"
                                {...register("phone")}
                                id="phone"
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="row g-3 align-items-center">
                        <div className="col-auto">
                            <label htmlFor="address" className="col-form-label">Address</label>
                        </div>
                        <div className="col-auto">
                            <input
                                type="text"
                                id="address"
                                className="form-control"
                            />
                        </div>
                    </div>
                    <button className="btn" type='submit'>Register</button>
                    <button className="btn">Cancel</button>
                </form>
            </div>
        </div>

    )
}
export default Register