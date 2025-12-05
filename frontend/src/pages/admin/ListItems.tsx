import img1 from "../../assets/p_img1.png";

function ListItems() {
  return (
    <div className="p-6">
      <div className="p-4">
        <h1 className="capitalize text-gray-700 text-xl mb-4">
          All product list
        </h1>

        {/* Table Header */}
        <div className="grid grid-cols-5 gap-4 border border-gray-400 p-2 font-semibold text-gray-600">
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Price</span>
          <span>Action</span>
        </div>

        {/* Table Row */}
        <div className="grid grid-cols-5 gap-4 items-center mt-3 border-b border-gray-200 py-2 border text-sm p-2">
          <div>
            <img
              src={img1}
              alt="Product"
              className="h-16 w-16 object-cover rounded"
            />
          </div>
          <div>Kid Tapered Slim Fit Trouser</div>
          <div>Kids</div>
          <div>$38</div>
          <div className="text-red-500 cursor-pointer">X</div>
        </div>
        <div className="grid grid-cols-5 gap-4 items-center mt-3 border-b border-gray-200 py-2 border text-sm p-2">
          <div>
            <img
              src={img1}
              alt="Product"
              className="h-16 w-16 object-cover rounded"
            />
          </div>
          <div>Kid Tapered Slim Fit Trouser</div>
          <div>Kids</div>
          <div>$38</div>
          <div className="text-red-500 cursor-pointer">X</div>
        </div>
        <div className="grid grid-cols-5 gap-4 items-center mt-3 border-b border-gray-200 py-2 border text-sm p-2">
          <div>
            <img
              src={img1}
              alt="Product"
              className="h-16 w-16 object-cover rounded"
            />
          </div>
          <div>Kid Tapered Slim Fit Trouser</div>
          <div>Kids</div>
          <div>$38</div>
          <div className="text-red-500 cursor-pointer">X</div>
        </div>
        <div className="grid grid-cols-5 gap-4 items-center mt-3 border-b border-gray-200 py-2 border text-sm p-2">
          <div>
            <img
              src={img1}
              alt="Product"
              className="h-16 w-16 object-cover rounded"
            />
          </div>
          <div>Kid Tapered Slim Fit Trouser</div>
          <div>Kids</div>
          <div>$38</div>
          <div className="text-red-500 cursor-pointer">X</div>
        </div>
        <div className="grid grid-cols-5 gap-4 items-center mt-3 border-b border-gray-200 py-2 border text-sm p-2">
          <div>
            <img
              src={img1}
              alt="Product"
              className="h-16 w-16 object-cover rounded"
            />
          </div>
          <div>Kid Tapered Slim Fit Trouser</div>
          <div>Kids</div>
          <div>$38</div>
          <div className="text-red-500 cursor-pointer">X</div>
        </div>
      </div>
    </div>
  );
}

export default ListItems;
