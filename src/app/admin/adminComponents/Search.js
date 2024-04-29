"use client";
function Search({
    search = "",
    setSearch = () => {}
}){
    return (
        <form>
            <input placeholder="Type a keyword..."  value={search}
                className="border rounded text-gray-700 leading-tight focus:outline-none py-[12px] px-3 ms-9 mt-3 mb-1"
                onChange={(e) => {
                    setSearch(e.target.value.trimStart()    
                )}}
            />
        </form>
    );
}

export {Search};