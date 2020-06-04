module.exports = {
    disable: false,
    name: "list",
    aliases: ["목록"],
    args: 0,
    usage: [],
    description: "학생 목록을 보여줍니다.",
    help: true,
    execute(message, args) {
        console.log(`[?] Command template: ${message} | ${args}`);
    },
};
