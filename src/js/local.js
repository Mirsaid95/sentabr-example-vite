const baseUrl = "https://fakestoreapi.com";

export async function getData(path) {
    try {
        const res = await fetch(`${baseUrl}/${path}`);
        const data = await res.json()
        return data;
    } catch (error) {
        console.log(error);
        
    }
}
