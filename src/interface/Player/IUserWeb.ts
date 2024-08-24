import IUserGeneral from "./IUserGeneral";

export default interface IUserWeb extends IUserGeneral{
     personaname:   string;
     avatarfull:    string;
     profileurl:    string;
     timecreated:   string;
     personastate:  number;
     colorChat:     string;
     glowColor:     string;
     created_at:    string;
}