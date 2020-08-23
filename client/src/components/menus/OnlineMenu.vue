<template>
    <div>
        <div class="menu" id="p1">
            <h3>{{ p1name }}</h3>
            <div class="circle red">
                <div class="score">
                    <h2>{{ (wins.p1 > 0) ? wins.p1 : null }}</h2>
                </div>
            </div>
        </div>
        <div class="menu" id="p2">
            <h3>{{p2name }}</h3>
            <div class="circle yellow">
                <div class="score">
                    <h2>{{ (wins.p2 > 0) ? wins.p2 : null }}</h2>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { bus } from '../../main'
export default {
    name: 'OnlineMenu',
    props: {
        p1name: String,
        p2name: String
    },
    data() {
        return {
            wins: {
                p1: 0,
                p2: 0
            }
        }
    },
    created() {
        bus.$on('updateOnlineWins', (winner) => {
            (winner === 'red') ? this.wins.p1++ : this.wins.p2++
        })
    }
}
</script>

<style scoped>
.menu {
    position: absolute;
    top: 200px;
    width: 200px;
    height: 100px;
    padding: 5px;
    background: transparent;
    border: 0px solid transparent;
}
#p1 {
    left: 50%;
    transform: translate(-520px);
    text-align: right;
}

#p2 {
    position: absolute;
    right: 50%;
    transform: translate(520px);
    text-align: left;
}

h6 {
    color: #17193b;
}

.circle {
    position: absolute;
    top: 35px;
    border-radius: 50%;
    width: 80px;
    height: 80px;
    text-align: center;
    padding-top: 15px;
}

.yellow {
    background: #fae119;
    right: 110px;
}
.red {
    background: #e11919;
    left: 110px;
}

.score {
    color: #17193b;
    padding-top: 8px;
}

</style>