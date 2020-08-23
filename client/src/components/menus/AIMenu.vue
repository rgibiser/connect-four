<template>
    <div>
        <div class="menu" id="player">
            <h3>You</h3>
            <div class="circle red">{{ (wins.p1 > 0) ? wins.p1 : null }}</div>
        </div>
        <div class="menu" id="cpu">
            <h3>CPU</h3>
            <div class="circle yellow">{{ (wins.cpu > 0) ? wins.cpu : null }}</div>
        </div>
    </div>
</template>

<script>
import { bus } from '../../main'
export default {
    name: 'AIMenu',
    data() {
        return {
            turn: true,
            wins: {
                cpu: 0,
                p1: 0
            }
        }
    },
    created() {
        bus.$on('updateWins', (winner) => {
            (winner === 1) ? this.wins.p1++ : this.wins.cpu++
        })
    }
}
</script>

<style>
.menu {
    position: absolute;
    top: 200px;
    width: 110px;
    height: 65px;
    background: #dddddd;
    padding: 5px;
    border-radius: 5px;
    border: 3px solid #17193b;
}
#player {
    left: 50%;
    transform: translate(-430px);
    text-align: right;
}

#cpu {
    position: absolute;
    right: 50%;
    transform: translate(430px);
    text-align: left;
}

h3 {
    color: #17193b;
}

.circle {
    position: absolute;
    top: 5px;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    text-align: center;
    padding-top: 15px;
}

.yellow {
    background: #fae119;
    right: 5px;
}
.red {
    background: #e11919;
    left: 5px;
}

</style>