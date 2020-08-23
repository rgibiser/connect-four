<template>
    <div id="blankPage">
        <h1>404 Not Found</h1>
        <router-link to="/" id="link">Go to homepage</router-link>
    </div>
  
</template>

<style scoped>
#blankPage {
    position: absolute;
    top: 0;
    width: 100%;
    height: 780px;
    background-color: whitesmoke;
    z-index: 100;
}

h1 {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 5%;
}

#link {
    position: absolute;
    top:12%;
    left: 50%;
    transform: translateX(-50%);
    text-decoration: none;
}
</style>