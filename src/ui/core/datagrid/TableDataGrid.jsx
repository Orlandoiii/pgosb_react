function GetKeyValuePairDataFromJson(jsonRawData) {
    let parseData = JSON.parse(jsonRawData);
    const transformedData = parseData.map(obj => {
        return Object.entries(obj).map(([key, value]) => ({
            key: key.trim(),
            value: value,
        }));
    });
    return transformedData;
}


function SortIcon({ }) {
    return (
        <>
            <span className="inline-block">
                <svg className="fill-current" width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 0L0 5H10L5 0Z" fill="">
                    </path>
                </svg>
            </span>
            <span className="inline-block">
                <svg className="fill-current" width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 5L10 0L-4.37114e-07 8.74228e-07L5 5Z" fill="">
                    </path>
                </svg>
            </span>
        </>
    )
}


function ColumnTitle({ name }) {

    return (
        <th className="" colSpan="1" role="columnheader" title="Toggle SortBy" >
            <div className="flex flex-col space-y-2">

                <div className="flex justify-between space-x-3  items-center w-full">
                    <span className="whitespace-nowrap text-gray-700 font-light text-sm">{name}</span>
                    <div className="inline-flex flex-col space-y-[3px]">
                        <SortIcon />
                    </div>
                </div>



                <input
                    type="text"
                    className="font-light text-sm w-full  h-[12] rounded-sm border border-stroke px-3 py-1 
                outline-none border-gray-300 focus:border-primary"/>


            </div>

        </th>
    )
}





export default function TableDataGrid({ data }) {
    const transformedData = GetKeyValuePairDataFromJson(data);

    const firstRegister = transformedData[0].slice(0, 6);

    const showValues = [];

    transformedData.forEach(v => {
        let newObj = v.slice(0, 6)
        showValues.push(newObj)
    })

    console.log(firstRegister);

    return (
        <div className=" bg-[white] border border-black overflow-x-auto">

            <header className="w-full mx-auto flex justify-between border border-gray-300 py-4 px-8">

                <div className="w-1/2 pr-2">
                    <input type="text" className="outline-none p-3 h-12 w-full 
                      border border-gray-300 rounded-md" placeholder="Buscar..." />
                </div>

                <div className="w-1/2 flex items-center justify-end font-medium">
                    <select className="bg-transparent pl-2">
                        <option>5</option>
                        <option>10</option>
                        <option>15</option>
                    </select>
                    <p className="pl-2 text-black text-sm">Registros Por Pagina</p>
                </div>

            </header>

            <table className="w-full table-auto border-collapse overflow-hidden my-4
            break-words px-4 md:table-fixed md:overflow-auto md:px-8">

                <thead className="border-separate px-4">
                    <tr className="flex space-x-4 px-6" role="row">
                        {firstRegister.map((value) => {
                            return <ColumnTitle name={value.key} key={value.key} />
                        })}
                    </tr>
                </thead>

                <tbody role="rowgroup">

                    {showValues.map(v => {
                        return <tr className="flex space-x-4 px-4" role="row">
                            {v.map(r => {
                                return <td colSpan="1" role="cell">
                                    {r.value}
                                </td>
                            })}
                        </tr>

                    })}

                </tbody>


            </table>



        </div>
    )
}