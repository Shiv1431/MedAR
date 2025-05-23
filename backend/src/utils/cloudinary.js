import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"



cloudinary.config({ 
  cloud_name:"dycv8u99r",
  api_key:"859318838417227",
  api_secret:"8_AjvgFnWgeXgnlQm3-ESEX0DU4"
});


const uploadOnCloudinary = async (localFilePath) => {
    
    try{
        if(!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        fs.unlinkSync(localFilePath)
        return response;
    } catch(err){
        fs.unlinkSync(localFilePath)
        console.log("cloudinary upload error ", err)
        return null;
    }
}


export {uploadOnCloudinary}
