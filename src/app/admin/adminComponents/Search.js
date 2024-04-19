function Search({
    search = "",
    setSearch = () => {}
}){
    return (
        <form>
            <input placeholder="search"  value={search}
                onChange={(e) => {
                    setSearch(e.target.value.trimStart()    
                )}}
            />
        </form>
    );
}

export {Search};