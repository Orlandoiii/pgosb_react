import ModalContainer from "../../core/modal/ModalContainer"
import AuthorityForm from "./Forms/AuthorityForm";
import React, { useState } from "react";


export default function AuthorityPage({ }) {
    const [openForm, setOpenForm] = useState(false);
    
    
    return (
        <>


            

            <ModalContainer onClose={() => setOpenForm(false)} show={openForm} showX={true} title={"Agregar Autoridad"}>

                <AuthorityForm>


                </AuthorityForm>

            </ModalContainer>

            <button onClick={() => setOpenForm(true)}>Open Model</button>


        </>


    )
}