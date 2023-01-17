import { tag } from "./Tagbar"
import "./componentsCSS/TagButton.css"

interface Props {
    indTag: tag,
    idx: number
}

let colorPalette = ["#f94144","#f3722c","#f8961e","#f9844a","#f9c74f","#90be6d","#43aa8b","#4d908e","#577590","#277da1"]


export const TagButton: React.FC<Props> = ({indTag, idx}) => {
    return (
        <div className="individualTags" style={{backgroundColor: colorPalette[idx % colorPalette.length]}}>{indTag.name}</div>
    )
}