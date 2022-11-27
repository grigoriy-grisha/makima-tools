import React, {useEffect, useState} from "react";
import AsyncLoadModule from "../AsyncLoadModule";

type DynamicModuleProps = {
    path: string
    name: string
}

function DynamicModule({path, name}: DynamicModuleProps) {
    const [importPath, setImportPath] = useState('')

    useEffect(() => {
        fetch(`${path}/importmap.json`)
            .then(response => response.json())
            .then(({imports}) => imports[name])
            .then(setImportPath)

    }, [])

    return <>{!!importPath && <AsyncLoadModule path={importPath}/>}</>
}

export default DynamicModule
