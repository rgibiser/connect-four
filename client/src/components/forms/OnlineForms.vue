<template>
    <transition enter-active-class="animated fadeIn">
        <div v-show='visible'>
            <form v-if="action==='create'" action="/online" @submit.prevent="handleSubmit(action)">
                <input type="text" name="game" class="nameInput" placeholder="Enter your name" v-model="name">
                <button type="submit">Submit</button>
            </form>
            <form v-if="action==='join'" action="/online" @submit.prevent="handleSubmit(action)">
                <input type="text" name="game" class="nameInput" id="joinInput" placeholder="Enter your name" v-model="name">
                <input type="text" name="game" class="roomInput" placeholder="Enter Room ID" maxlength="8" size="8" v-model="room">
                <button type="submit">Submit</button>
            </form>
        </div>
    </transition>
</template>

<script>
import { bus } from '../../main'
import { v1 as uuidv1 } from 'uuid'

export default {
    name: 'OnlineForms',
    props: {
        action: {
            type: String
        }
    },
    data() {
        return {
            name: '',
            room: '',
            visible: false
        }
    },
    mounted() {
        let self = this;
        setTimeout(function(){self.visible = true;}, 150)
    },
    methods: {
        handleSubmit: function(action) {
            if (action === 'create') {
                let id = uuidv1().substr(0,8)
                this.$router.push({ name: 'game', params: {gameID: id} })
                setTimeout(() => bus.$emit('hostName', this.name), 300)
            }
            else if (action === 'join') {
                this.$router.push({ name: 'game', params: {gameID: this.room} })
                setTimeout(() => bus.$emit('guestName', this.name), 300)
            }
        }
    }
}
</script>

<style scoped>
.nameInput {
    position: absolute;
    width: 210px;
    height: 40px;
    top: 110px;
    left: 50%;
    transform: translateX(-69%);
    z-index: 5;
    text-align: center;
}

.roomInput {
    position: absolute;
    width: 210px;
    height: 40px;
    top: 132px;
    left: 50%;
    transform: translateX(-69%);
    z-index: 5;
    text-align: center;
}

#joinInput {
    top: 88px;
}

button {
    position: absolute;
    height: 40px;
    width: 70px;
    top: 110px;
    left: 50%;
    transform: translateX(100%);
    z-index: 5;
}

.fade-in-enter-active {
    animation: fadeIn 3.5s ease 1 forwards;
} @keyframes fadeIn {
    0% { opacity: 0; }
    50% { opacity: 0; }
    100% { opacity: 100%; }
}
</style>