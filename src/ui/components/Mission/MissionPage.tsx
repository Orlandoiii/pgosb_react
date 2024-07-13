import React, { useState } from 'react'

import TableDataGrid from '../../core/datagrid/TableDataGrid'
import testJson from '../../../mocks/operations.json'
import PersonForm from './Forms/PersonForm'
import AuthorityForm from './Forms/AuthorityForm'
import VehicleForm from './Forms/VehicleForm'

const MissionPage = () => {
    const [openAddForm, setOpenAddForm] = useState(false)

    function onUpdate() {}
    return (
        <>
            <div className="">
                <TableDataGrid
                    rawData={JSON.stringify(testJson)}
                    onAdd={() => {
                        setOpenAddForm(true)
                    }}
                    onDoubleClickRow={() => {}}
                    permissions={''}
                    onDelete={() => {}}
                    onUpdate={onUpdate}
                />

                <PersonForm
                    showModal={false}
                    onClose={() => setOpenAddForm(false)}
                ></PersonForm>
                <AuthorityForm
                    showModal={false}
                    onClose={() => setOpenAddForm(false)}
                ></AuthorityForm>
                <VehicleForm
                    showModal={openAddForm}
                    onClose={() => setOpenAddForm(false)}
                ></VehicleForm>
            </div>
        </>
    )
}

export default MissionPage
