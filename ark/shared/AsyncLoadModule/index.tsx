import React, {lazy, Suspense} from "react";
import {identity} from "ramda";

type AsyncLoadModuleProps = {
    path: string
}

function AsyncLoadModule({path}: AsyncLoadModuleProps) {
    const Module = lazy(async () => {
        const application =  await System.import(path).then((r) => r, identity);

        console.log(application)
        return  application;
    });

    return (
        <Suspense fallback={null}>
            <Module/>
        </Suspense>
    );
}

export default AsyncLoadModule;
