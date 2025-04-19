<x-layout>
    <form action="/register" method="POST">
        @csrf

        <label for="username">username</label>

        <input name="username" />
        <br />
        <label for="password">password</label>
        <input name="password" />
        <br />
        <button>Submit</button>
    </form>
</x-layout>
