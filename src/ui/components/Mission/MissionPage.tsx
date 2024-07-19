import React, { useState } from 'react'

import TableDataGrid from '../../core/datagrid/TableDataGrid'
import testJson from '../../../mocks/operations.json'
import ServiceForm from './Forms/ServiceForm'

const MissionPage = () => {
    const [openAddForm, setOpenAddForm] = useState(false)

    function onUpdate() {}
    return (
        <>
            <div className="">
                <TableDataGrid
                    rawData={testJson}
                    onAdd={() => {
                        setOpenAddForm(true)
                    }}
                    onDoubleClickRow={() => {}}
                    permissions={''}
                    onDelete={() => {}}
                    onUpdate={onUpdate}
                />

                {openAddForm && (
                    <ServiceForm
                        showModal={false}
                        onClose={() => setOpenAddForm(false)}
                    ></ServiceForm>
                )}
            </div>
        </>
    )
}

export default MissionPage
