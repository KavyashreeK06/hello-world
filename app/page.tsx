export default function HomePage() {
    return (
        <main style={{ padding: 24 }}>
            <h1>Hello World</h1>

            <ul>
                <li><a href="/login">Go to /login</a></li>
                <li><a href="/protected">Go to /protected (gated)</a></li>
                <li><a href="/list">Go to /list</a></li>
            </ul>
        </main>
    );
}

