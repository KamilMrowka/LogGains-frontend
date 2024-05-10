interface Props {
    onClick: React.MouseEventHandler<HTMLButtonElement>,
}

export default function( { onClick }: Props ) {
    return (
        <>
            Helloo Here for an update
            <button onClick={onClick}>Cancel</button>
        </>
    ) 
}