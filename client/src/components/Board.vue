<template>
    <div class="container">
        <header>
            <h1>Connect Four</h1><br>
        </header>
        <main>
            <div class="board">
                <table id="table" ref="table">
                    <tr>
                        <td><div class="hole"></div></td>
                        <td><div class="hole"></div></td>
                        <td><div class="hole"></div></td>
                        <td><div class="hole"></div></td>
                        <td><div class="hole"></div></td>
                        <td><div class="hole"></div></td>
                        <td><div class="hole"></div></td>
                    </tr>
                    <tr>
                        <td><div class="hole"></div></td>
                        <td><div class="hole"></div></td>
                        <td><div class="hole"></div></td>
                        <td><div class="hole"></div></td>
                        <td><div class="hole"></div></td>
                        <td><div class="hole"></div></td>
                        <td><div class="hole"></div></td>
                    </tr>
                    <tr>
                        <td><div class="hole"></div></td>
                        <td><div class="hole"></div></td>
                        <td><div class="hole"></div></td>
                        <td><div class="hole"></div></td>
                        <td><div class="hole"></div></td>
                        <td><div class="hole"></div></td>
                        <td><div class="hole"></div></td>
                    </tr>
                    <tr>
                        <td><div class="hole"></div></td>
                        <td><div class="hole"></div></td>
                        <td><div class="hole"></div></td>
                        <td><div class="hole"></div></td>
                        <td><div class="hole"></div></td>
                        <td><div class="hole"></div></td>
                        <td><div class="hole"></div></td>
                    </tr>
                    <tr>
                        <td><div class="hole"></div></td>
                        <td><div class="hole"></div></td>
                        <td><div class="hole"></div></td>
                        <td><div class="hole"></div></td>
                        <td><div class="hole"></div></td>
                        <td><div class="hole"></div></td>
                        <td><div class="hole"></div></td>
                    </tr>
                    <tr>
                        <td><div class="hole"></div></td>
                        <td><div class="hole"></div></td>
                        <td><div class="hole"></div></td>
                        <td><div class="hole"></div></td>
                        <td><div class="hole"></div></td>
                        <td><div class="hole"></div></td>
                        <td><div class="hole"></div></td>
                    </tr>
                </table>
            </div>
        </main>
        <footer>
            2020&copy; Ryan Gibiser | <a href="http://www.github.com/rgibiser/connect-four" target="_blank">GitHub - rgibiser</a>
        </footer>
    </div>
</template>

<script>
export default {
    name: 'Board'
}
</script>

<style scoped>
.container {
    position: relative;
    height: 850px;
}

header {
    text-align: center;
    padding-top: 20px;
}

h1 {
    font-size: 40px;
    color: #17193b;
}

.board {
    position: relative;
    background: #17193b;
    top: 110px;
    width:630px;
    height:540px;
    margin:0 auto;
}

table {
    border-spacing: 0px;
}

td {
    position: relative;
    overflow: hidden;
    border: 5px solid #002b80;
    padding: 0px;
    z-index: 5;
}

.hole {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  box-shadow: 0 0 0 100px rgba(0, 43, 128, 0.99);
}

footer {
    color: #707070;
    text-align: center;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 50px;
}

a {
    color: inherit;
    text-decoration: none;
}

</style>