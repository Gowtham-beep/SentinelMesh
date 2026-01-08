export async function httpCheck(
    url:string,
    timeoutMs= 5000
){
    const controller = new AbortController();
    const start = Date.now();

    const timeout = setTimeout(()=>{
        controller.abort();
    },timeoutMs);

    try{
        const res = await fetch(url,{
            signal:controller.signal
        });
        const latencyMs = Date.now() - start;

        return{
            status:res.ok?"UP":"DOWN",
            statuscode:res.status,
            latencyMs
        };
    }catch(err: unknown){
        const error = err as Error;
        return{
            status:"DOWN",
            error:error.name === "AbortError"?"request timed out":error.message
        };
    }finally{
        clearTimeout(timeout);
    }
}
