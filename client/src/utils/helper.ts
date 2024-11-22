
export const getFileSize = (size:number) => {
    try {
        const baseMetric = 1024;
        let tempSize = size/baseMetric   //(in kbs)
        if(tempSize < baseMetric){
            return `${tempSize.toFixed(2)} KB`
        }

        tempSize = tempSize/baseMetric  //(in mbs)
        if(tempSize < baseMetric){
             return `${tempSize.toFixed(2)} MB`
        }

        //(in gbs)
        return `${(tempSize/1024).toFixed(2)} GB`
        
    } catch (err) {
        console.log("errro in solving")
        return null
    }
}