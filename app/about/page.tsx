import { CodePanel } from "@/components/Editor/Editor";
export default function about() {
  const reactExample = `
   import React from 'react'; const Section = () => { return ( <section className="bg-gray-100 py-16"> <div className="container mx-auto px-4"> <h2 className="text-3xl font-bold text-gray-800 mb-4">User Card</h2> <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"> <div className="mb-4"> <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name"> Name </label> <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="John Doe" /> </div> <div className="mb-4"> <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email"> Email </label> <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="john.doe@example.com" /> </div> <div className="mb-4"> <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password"> Password </label> <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="********" /> </div> <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" > Submit </button> </div> </div> </section> ); }; export default Section;
  `;
  return (
    <div className="h-screen w-full mt-2">
      <CodePanel code={reactExample} />
    </div>
  );
}
