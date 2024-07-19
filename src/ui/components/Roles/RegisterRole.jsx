import React from 'react';
import ModalContainer from '../../core/modal/ModalContainer';
import PermissionTable from './PermissionTable/components/PermissionTable';
import Input from '../../core/inputs/Input';
import Toggle from '../../core/buttons/Toggle';
import Button from '../../core/buttons/Button';



function RegisterRole({ open, onClose,
    roleName = "",
    setRolName,
    roleState = false,
    setStateRol,
    title = "Agregar Rol",
    buttonTitle = "Agregar",
    readonly = false,
    statePermission,
    setStatePermission,
    onSubmit
}) {




    return (
        <ModalContainer show={open} showX={true} title={title} onClose={onClose}>
            <div className=''>


                <div className='flex justity-between items-center w-full px-4 py-2 bg-white mb-4 rounded-sm shadow-sm'>
                    <div className='flex justify-center items-center w-full space-x-3'>
                        <p className='text-lg font-medium'>Nombre del Rol:</p>
                        <div className='w-[60%]'>
                            <Input readOnly={readonly} inputName={"role_name"} label={""}  value={roleName}
                                onChange={(e) => {
                                    if (readonly)
                                        return;
                                    setRolName(e.target.value)
                                }} />
                        </div>

                    </div>

                    <div className='flex w-full justify-center items-center space-x-3'>
                        <p className='text-lg font-medium'>Estado del Rol:</p>
                        <Toggle active={roleState} setActive={() => {
                            if (readonly)
                                return;
                            setStateRol(a => !a);
                        }} />
                    </div>
                </div>


                <h3 className='w-full text-center text-lg font-medium mb-4 bg-[#0A2F4E] text-white rounded-sm shadow-sm py-1'>
                    Permisos
                </h3>
                <PermissionTable
                    readonly={readonly}
                    ModulesAccess={statePermission}
                    onModulesAccessChanged={(newModulesAccess) => setStatePermission(newModulesAccess)}
                    viewPermissionName='ver'
                />

                {!readonly && <div className='w-full mt-4 p-2'>
                    <Button width='w-full' onClick={onSubmit}>{buttonTitle}</Button>
                </div>}


            </div>

        </ModalContainer>
    );
}

export default RegisterRole;