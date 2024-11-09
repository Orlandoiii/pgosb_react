import React, { useCallback, useEffect, useState } from 'react'
import ModalLayout from '../../../optimized/components/layouts/modal_layout.tsx'
import { AddableTable } from '../../Temp/AddableTable.tsx'
import TextInput from '../../../alter/components/inputs/text_input.tsx'
import LoadingModal from '../../../core/modal/LoadingModal.tsx'
import { useActionModalAndCollection } from '../../../core/hooks/useActionModalAndCollection.ts'
import { missionAuthorityPersonCrud, MissionAuthorityPersonNameConverter } from '../../../../domain/models/authority/authority_person.ts'
import { missionAuthorityVehicleCrud, MissionAuthorityVehicleNameConverter } from '../../../../domain/models/authority/authority_vehicle.ts'
import { AuthorityPersonForm } from './AuthorityPersonForm.tsx'
import { AuthorityVehicleForm } from './AuthorityVehicleForm.tsx'
import { modalService } from '../../../core/overlay/overlay_service.tsx'
import { SelectWithSearch } from '../../../alter/components/inputs/select_with_search.tsx'
import { getAll } from '../../../../services/http.tsx'
import { MissionAuthorityFront } from '../../../../domain/models/mission/authority/mission_authority.ts'
import { useMissionAuthorityActions } from '../../../../domain/models/mission/authority/use_collection.ts'


interface AutorityFormProps {
    initValue: MissionAuthorityFront | undefined
    closeOverlay?: () => void
    add?: boolean
}

export function AuthorityForm({ 
    initValue,
    closeOverlay,
    add = true,
}: AutorityFormProps) {
    const authorityActions = useMissionAuthorityActions();
    const [isVisible, setIsVisible] = useState(true)
    const [loading, setLoading] = useState(false)

    const [alias, setAlias] = useState(initValue ? initValue.alias : '')
    const [type, setType] = useState(initValue ? initValue.institutionId : '')
    const [typesCollection, setTypesCollection] = useState<{ id: string, name: string, abbreviation: string, government: string }[]>([])

    const [authorityVehicleActions, vehicles] = useActionModalAndCollection(
        AuthorityVehicleForm,
        missionAuthorityVehicleCrud,
        { mission_id: initValue?.missionId, authorityId: initValue?.id } as any,
        initValue!.id
    )

    const [authorityPersonActions, people] = useActionModalAndCollection(
        AuthorityPersonForm,
        missionAuthorityPersonCrud,
        { mission_id: initValue?.missionId, authorityId: initValue?.id } as any,
        initValue!.id
    )

    useEffect(() => {
        getAuthorityTypes()
    }, [])

    const getAuthorityTypes = useCallback(async () => {
        const response = await getAll<{ id: string, name: string, abbreviation: string, government: string }>(
            'authority'
        )
        if (response.success && response.result)
            return setTypesCollection(response.result)
        else return setTypesCollection([])
    }, [])

    async function updateService() {
        const authorityResult = await authorityActions.getById(initValue!.id)

        if (
            authorityResult.success &&
            authorityResult.result &&
            (authorityResult.result?.alias != alias || authorityResult.result?.institution_id != type)
        ) {
            authorityResult.result.alias = alias
            authorityResult.result.institution_id = type
            const updateResult = await authorityActions.updateFront(authorityResult.result)

            if (updateResult.success)
                modalService.toastSuccess('Autoridad actualizada!')
            else modalService.toastError('No se pudo actualizar la autoridad!')
        }
    }

    useEffect(() => {
        updateService()
    }, [type])

    console.log();


    return (
        <>
            <ModalLayout
                title={'Registro de Autoridad'}
                isVisible={isVisible}
                onClosed={closeOverlay}
                className="min-w-[70vw]"
                onClose={() => {
                    setIsVisible(false)
                }}
            >
                <div className="flex justify-between w-full">
                    <div className="flex items-center space-x-4">
                        <div className="font-semibold text-slate-700 text-xl">
                            Alias:
                        </div>
                        <TextInput
                            value={alias}
                            onChange={(e) => setAlias(e.currentTarget.value)}
                            onBlur={updateService}
                        ></TextInput>
                    </div>

                    <div className=" w-80">
                        <SelectWithSearch
                            description="Tipo"
                            options={typesCollection}
                            selectedOption={type}
                            selectionChange={(e) => setType(e)}
                            valueKey={'id'}
                            displayKeys={['abbreviation', 'name']}
                        />
                    </div>
                </div>

                <div className="h-8"></div>

                <AddableTable
                    title="Vehiculos"
                    data={vehicles ?? []}
                    defaultSort={'id'}
                    idPropertyName="id"
                    addButtonText="Agregar un vehículo"
                    nameConverter={MissionAuthorityVehicleNameConverter}
                    onAddButtonClick={authorityVehicleActions.add}
                    onEditButtonClick={authorityVehicleActions.edit}
                    onDeleteButtonClick={authorityVehicleActions.delete}
                ></AddableTable>

                <div className="h-8"></div>

                <AddableTable
                    title="Funcionarios"
                    data={people ?? []}
                    defaultSort={'id'}
                    idPropertyName="id"
                    addButtonText="Agregar un funcionario"
                    nameConverter={MissionAuthorityPersonNameConverter}
                    onAddButtonClick={authorityPersonActions.add}
                    onEditButtonClick={authorityPersonActions.edit}
                    onDeleteButtonClick={authorityPersonActions.delete}
                ></AddableTable>
            </ModalLayout>
            <LoadingModal initOpen={loading} children={null} />
        </>
    )
}