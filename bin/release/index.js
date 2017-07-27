import { config } from 'config'
import { Release } from 'release'

const releaseObj = new Release()
const filesAllObj = releaseObj.getArrayFilesByTypes(config.FILTER_FILES_TYPE)


