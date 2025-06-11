import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

const FilterSidebar = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()
    const [filter, setFilter] = useState({
        category: "",
        gender: "",
        colors: "",
        sizes: [],
        material: [],
        brand: [],
        minPrice: 0,
        maxPrice: 1000
    })
    const [priceRange, setPriceRange] = useState([0, 1000])
    const categories = ["Top Wear", "Bottom Wear"]
    const gender = ["Men", "Women"]
    const colors = [
        "Red",
        "Blue",
        "Black",
        "Green",
        "Yellow",
        "Gray",
        "White",
        "Pink",
        "Beige",
        "Navy"
    ];
    const sizes = ["XS", "S", "M", "L", "XL", "XXL"]
    const materials = [
        "Cotton",
        "Wool",
        "Denim",
        "Polyester",
        "Silk",
        "Linen",
        "Viscose",
        "Fleece"
    ]
    const brands = [
        "Urban Threads",
        "Modern Fit",
        "Street Styles",
        "Beach Breeze",
        "Fashionable",
        "ChicStyles"
    ]

    useEffect(() => {
        const params = Object.fromEntries([...searchParams])

        setFilter({
            category: params.category || "",
            gender: params.gender || "",
            colors: params.color || "",
            sizes: params.size ? params.size.split(",") : [],
            material: params.material ? params.material.split(",") : [],
            brand: params.brand ? params.brand.split(",") : [],
            minPrice: Number(params.minPrice) || 0,
            maxPrice: Number(params.maxPrice) || 1000,
        })
        setPriceRange([0, params.maxPrice || 1000])
    }, [searchParams])

    const handleFilterChange = (e) => {
        const { name, value, checked, type } = e.target
        let newFilter = { ...filter }

        if (type === "checkbox") {
            if (checked) {
                newFilter[name] = [...(newFilter[name] || []), value];
            }
            else {
                newFilter[name] = newFilter[name].filter((item) => item !== value)
            }
        }
        else{
            newFilter[name] = value
        }
        setFilter(newFilter)
        updateURLParams(newFilter)
        // console.table(newFilter);

        // console.table({name, value, type, checked});
    }

    const updateURLParams = (newFilter) => {
        const params = new URLSearchParams();

        Object.keys(newFilter).forEach((key) => {
            if(Array.isArray(newFilter[key]) && newFilter[key].length > 0){
                params.append(key, newFilter[key].join(","));
            }
            else if(newFilter[key]){
                params.append(key, newFilter[key])
            }
        });
        setSearchParams(params)
        navigate(`?${params.toString()}`) // ?category=Bottom+Wear&size=XS%2C5
    }

    const handlePriceChange = (e) => {
        const newPrice = e.target.value;
        setPriceRange([0, newPrice])
        const newFilter = {...filter, minPrice: 0, maxPrice: newPrice};
        setFilter(newFilter)
        updateURLParams(newFilter)
    }
    return (
        <div className="p-4">
            <h3 className="text-xl font-medium text-gray-800 mb-4">Filter</h3>
            {/* Category Filter */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Category:</label>
                {categories?.map((category) => (
                    <div key={category} className="flex items-center mb-1">
                        <input
                            type="radio"
                            className="radio w-4 h-4 !bg-white text-main-theme mr-2"
                            name="category"
                            value={category}
                            checked={filter.category === category}
                            onChange={handleFilterChange}
                        />
                        <span className="text-gray-700">{category}</span>
                    </div>
                ))}
            </div>

            {/* Gender Filter */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Gender:</label>
                {gender?.map((gender) => (
                    <div key={gender} className="flex items-center mb-1">
                        <input
                            type="radio"
                            className="radio w-4 h-4 !bg-white text-main-theme mr-2"
                            name="gender"
                            value={gender}
                            checked={filter.gender === gender}
                            onChange={handleFilterChange}
                        />
                        <span className="text-gray-700">{gender}</span>
                    </div>
                ))}
            </div>

            {/* Color Filter */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Color:</label>
                <div className="flex flex-wrap gap-2">
                    {colors?.map((color) => (
                        <button
                            key={color}
                            name="color"
                            value={color}
                            onClick={handleFilterChange}
                            checked={filter.colors === color}
                            className={`btn btn-circle bg-transparent border-0 ${filter.colors === color ? 'ring-1 ring-main-theme ring-offset-2' : ''}`}
                            style={{ backgroundColor: color.toLowerCase() }}
                        ></button>
                    ))}
                </div>
            </div>

            {/* Size filter */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Size:</label>
                {sizes?.map((size) => (
                    <div key={size} className="flex items-center mb-1">
                        <input
                            name="size"
                            value={size}
                            onChange={handleFilterChange}
                            checked={filter.sizes.includes(size)}
                            type="checkbox"
                            className="checkbox border border-main-theme text-main-theme mr-2" />
                        <span className="">{size}</span>
                    </div>
                ))}
            </div>

            {/* Material filter */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Material:</label>
                {materials?.map((material) => (
                    <div key={material} className="flex items-center mb-1">
                        <input
                            name="material"
                            value={material}
                            onChange={handleFilterChange}
                            checked={filter.material.includes(material)}
                            type="checkbox"
                            className="checkbox border border-main-theme text-main-theme mr-2" />
                        <span className="">{material}</span>
                    </div>
                ))}
            </div>

            {/* brands filter */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Brands:</label>
                {brands?.map((brand) => (
                    <div key={brand} className="flex items-center mb-1">
                        <input
                            name="brand"
                            value={brand}
                            onChange={handleFilterChange}
                            checked={filter.brand.includes(brand)}
                            type="checkbox"
                            className="checkbox border border-main-theme text-main-theme mr-2" />
                        <span className="">{brand}</span>
                    </div>
                ))}
            </div>

            {/* Price Range Filter */}
            <div className="mb-8">
                <label className="block text-gray-600 font-medium mb-2">Price Range:</label>
                <input 
                type="range" 
                name="priceRange"
                value={priceRange[1]}
                onChange={handlePriceChange}
                min={0} 
                max={1000} 
                className="range range-error !text-main-theme" 
                />
                <div className="flex justify-between text-gray-600 mt-2">
                    <span className="">₹ 0</span>
                    <span className="">₹ 1000</span>
                </div>
            </div>
        </div>
    )
}

export default FilterSidebar