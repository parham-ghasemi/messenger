const ownItems = [
  'Copy',
  'Delete'
]
const otherItems = [
  'Copy',
  'Reply',
  'Delete'
]

interface ContextMenuProps {
  left: number
  top: number
  isown: boolean
  handleCopy: (text: string) => void;
  onDelete: (option: boolean) => void;
}

function ContextMenu({ left, top, isown, handleCopy, onDelete }: ContextMenuProps) {
  return (

    <div className="rounded-md overflow-hidden text-sm text-neutral-900 fixed" style={{ top: top, left: left }}>
      <ul className="w-full h-full flex flex-col justify-between">
        {
          isown ? ownItems.map((item, index) => (
            <li
              key={index}
              onClick={() => {
                item === 'Copy' ? handleCopy('') : null
                item === 'Delete' ? onDelete(true) : null
              }}
              className=" bg-stone-300 opacity-90 hover:opacity-100 hover:bg-stone-400 hover:text-black h-full w-full px-4 py-1 cursor-pointer"
            >
              {item}
            </li>
          ))
            :
            otherItems.map((item, index) => (
              <li
                key={index}
                onClick={() => {
                  item === 'Copy' ? handleCopy('') : null
                  item === 'Delete' ? onDelete(true) : null
                  item === 'Reply' ? onDelete(true) : null
                }}
                className=" bg-stone-300 opacity-90 hover:opacity-100 hover:bg-stone-400 hover:text-black h-full w-full px-4 py-1 cursor-pointer"
              >
                {item}
              </li>
            ))
        }
      </ul>
    </div>
  )
}

export default ContextMenu