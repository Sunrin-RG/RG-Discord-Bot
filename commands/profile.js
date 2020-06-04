module.exports = {
    disable: false,
    name: "profile",
    aliases: ["info", "프로필", "정보"],
    args: 1,
    usage: ["<이름|학번>"],
    description: "학생의 정보를 보여줍니다.",
    help: true,
    execute(message, args) {
        const {
            getInterviewData,
            getDataFromRow,
            getProfileFromData,
        } = require("../index");

        let cells = getInterviewData().filter(function (value) {
            return (
                (value.gs$cell.col == 3 &&
                    value.gs$cell.inputValue === args[0]) ||
                (value.gs$cell.col == 2 && value.gs$cell.inputValue === args[0])
            );
        });
        if (!cells || !cells.length) {
            return message.reply(
                `\`${args[0]}\` 학생은 목록에 존재하지 않습니다!`
            );
        }

        var data = getDataFromRow(cells[0].gs$cell.row);
        message.channel.send(getProfileFromData(data));
    },
};
