interface MessageData {
    data: {
        amount: string | undefined;
        description: string | undefined;
    };
}
export default function PricMessage({ data }: MessageData) {
    return (
        <div className="bg-gray-200 p-4 rounded-[20px] flex flex-col justify-between min-h-[200px] relative shadow-sm min-w-80">
            {/* Description Section */}
            <div className="flex justify-between mb-4">
                <div>
                    <h3 className="font-semibold text-lg">Description</h3>
                    <p className="text-left text-gray-700">{data.description}.</p>
                </div>
                {/* Amount on the right */}
                <div className="text-right">
                    <h3 className="font-semibold text-lg">Amount</h3>
                    <p className="font-bold text-xl text-gray-800">${data.amount}</p>
                </div>
            </div>

            <button className="bg-gray-200 text-black py-2 px-4 rounded-lg absolute bottom-4 right-4">
                <b> Withdraw quote</b>
            </button>
        </div>
    );
}