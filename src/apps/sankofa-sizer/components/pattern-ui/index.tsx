/*
const Pattern = () => {
    return (
      <div className="flex w-full justify-center items-center bg-white p-8">
        <h1 className="text-lg font-semibold">Hello World</h1>
        <p>


        </p>
      </div>
    );
  };
  
  export default Pattern;
  */
  import React from 'react';
  
  const Pattern = () => {
  
    return (
        <div>
            <div className="flex w-full bg-gray-200 p-8">
            <div className="flex-1 p-4">
                <h2 className="font-semibold">Sloper/Pattern</h2>
                <button className="mt-2 bg-white p-2 border border-gray-300">Add Image</button>
                {/* Add more UI elements for image as needed */}
            </div>
            <div className="flex-1 p-4">
                <h2 className="font-semibold">Measures</h2>
                <ul>
                <li>Arm Length</li>
                <li>Neck Width</li>
                {/* Add more measurements as needed */}
                </ul>
                <div>Tolerance</div>
                <textarea className="w-full mt-2 p-2 border border-gray-300" placeholder="Notes"></textarea>
            </div>
            </div>
            <button className="w-full bg-blue-500 text-white p-4 mt-4">
            Switch to Body Model
            </button>
        </div>
    );
  };
  
  export default Pattern;