import { useSearchParams } from "react-router-dom"

const SortOption = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  
  const sortBy = searchParams.get("sortBy") || "Default"

  const handleSortChange = (e) => {
    const sortBy = e.target.value
    if (sortBy === "Default") {
      searchParams.delete("sortBy")
    } else {
      searchParams.set("sortBy", sortBy)
    }
    setSearchParams(searchParams)
  }

  return (
    <div className="flex items-center justify-end">
      <select 
        className="select w-60 select-neutral bg-transparent focus:outline-main-theme"
        value={sortBy}
        onChange={handleSortChange}
      >
        <option value="Default">Default</option>
        <option value="priceAsc">Price: Low to High</option>
        <option value="priceDesc">Price: High to Low</option>
        <option value="popularity">Popularity</option>
      </select>
    </div>
  )
}

export default SortOption
