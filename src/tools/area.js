const arealist = [
    {
        name_en: 'Angola',
        name_zh: '安哥拉',
        key: 'AO',
        code: '244'
    },
    {
        name_en: 'Afghanistan',
        name_zh: '阿富汗',
        key: 'AF',
        code: '93'
    },
    {
        name_en: 'Albania',
        name_zh: '阿尔巴尼亚',
        key: 'AL',
        code: '355'
    },
    {
        name_en: 'Algeria',
        name_zh: '阿尔及利亚',
        key: 'ALG',
        code: '213'
    },
    {
        name_en: 'Andorra',
        name_zh: '安道尔共和国',
        key: 'AD',
        code: '376'
    },
    {
        name_en: 'Anguilla',
        name_zh: '安圭拉岛',
        key: 'AI',
        code: '1264'
    },
    {
        name_en: 'Antigua and Barbuda',
        name_zh: '安提瓜和巴布达',
        key: 'AG',
        code: '1268'
    },
    {
        name_en: 'Argentina',
        name_zh: '阿根廷',
        key: 'AR',
        code: '54'
    },
    {
        name_en: 'Armenia',
        name_zh: '亚美尼亚',
        key: 'AM',
        code: '374'
    },
    {
        name_en: 'Ascension',
        name_zh: '阿森松',
        key: 'AS',
        code: '247'
    },
    {
        name_en: 'Australia',
        name_zh: '澳大利亚',
        key: 'AU',
        code: '61'
    },
    {
        name_en: 'Austria',
        name_zh: '奥地利',
        key: 'AT',
        code: '43'
    },
    {
        name_en: 'Azerbaijan',
        name_zh: '阿塞拜疆',
        key: 'AZ',
        code: '994'
    },
    {
        name_en: 'Bahamas',
        name_zh: '巴哈马',
        key: 'BS',
        code: '1242'
    },
    {
        name_en: 'Bahrain',
        name_zh: '巴林',
        key: 'BH',
        code: '973'
    },
    {
        name_en: 'Bangladesh',
        name_zh: '孟加拉国',
        key: 'BD',
        code: '880'
    },
    {
        name_en: 'Barbados',
        name_zh: '巴巴多斯',
        key: 'BB',
        code: '1246'
    },
    {
        name_en: 'Belarus',
        name_zh: '白俄罗斯',
        key: 'BY',
        code: '375'
    },
    {
        name_en: 'Belgium',
        name_zh: '比利时',
        key: 'BE',
        code: '32'
    },
    {
        name_en: 'Belize',
        name_zh: '伯利兹',
        key: 'BZ',
        code: '501'
    },
    {
        name_en: 'Benin',
        name_zh: '贝宁',
        key: 'BJ',
        code: '229'
    },
    {
        name_en: 'Bermuda Is.',
        name_zh: '百慕大群岛',
        key: 'BM',
        code: '1441'
    },
    {
        name_en: 'Bolivia',
        name_zh: '玻利维亚',
        key: 'BO',
        code: '591'
    },
    {
        name_en: 'Botswana',
        name_zh: '博茨瓦纳',
        key: 'BW',
        code: '267'
    },
    {
        name_en: 'Brazil',
        name_zh: '巴西',
        key: 'BR',
        code: '55'
    },
    {
        name_en: 'Brunei',
        name_zh: '文莱',
        key: 'BN',
        code: '673'
    },
    {
        name_en: 'Bulgaria',
        name_zh: '保加利亚',
        key: 'BG',
        code: '359'
    },
    {
        name_en: 'Burkina-faso',
        name_zh: '布基纳法索',
        key: 'BF',
        code: '226'
    },
    {
        name_en: 'Burma',
        name_zh: '缅甸',
        key: 'BUR',
        code: '95'
    },
    {
        name_en: 'Burundi',
        name_zh: '布隆迪',
        key: 'BI',
        code: '257'
    },
    {
        name_en: 'Cameroon',
        name_zh: '喀麦隆',
        key: 'CM',
        code: '237'
    },
    {
        name_en: 'Canada',
        name_zh: '加拿大',
        key: 'CA',
        code: '1'
    },
    {
        name_en: 'Cayman Islands',
        name_zh: '开曼群岛',
        key: 'CAY',
        code: '1345'
    },
    {
        name_en: 'Central African Republic',
        name_zh: '中非共和国',
        key: 'CAR',
        code: '236'
    },
    {
        name_en: 'Chad',
        name_zh: '乍得',
        key: 'CHAD',
        code: '235'
    },
    {
        name_en: 'Chile',
        name_zh: '智利',
        key: 'CL',
        code: '56'
    },
    {
        name_en: 'China',
        name_zh: '中国',
        key: 'CN',
        code: '86'
    },
    {
        name_en: 'Colombia',
        name_zh: '哥伦比亚',
        key: 'CO',
        code: '57'
    },
    {
        name_en: 'Congo',
        name_zh: '刚果',
        key: 'CG',
        code: '242'
    },
    {
        name_en: 'Cook Islands',
        name_zh: '库克群岛',
        key: 'CK',
        code: '682'
    },
    {
        name_en: 'Costa Rica',
        name_zh: '哥斯达黎加',
        key: 'CR',
        code: '506'
    },
    {
        name_en: 'Cuba',
        name_zh: '古巴',
        key: 'CU',
        code: '53'
    },
    {
        name_en: 'Cyprus',
        name_zh: '塞浦路斯',
        key: 'CY',
        code: '357'
    },
    {
        name_en: 'Czech Republic',
        name_zh: '捷克',
        key: 'CZ',
        code: '420'
    },
    {
        name_en: 'Denmark',
        name_zh: '丹麦',
        key: 'DK',
        code: '45'
    },
    {
        name_en: 'Djibouti',
        name_zh: '吉布提',
        key: 'DJ',
        code: '253'
    },
    {
        name_en: 'Dominica Rep.',
        name_zh: '多米尼加共和国',
        key: 'DM',
        code: '1767'
    },
    {
        name_en: 'Ecuador',
        name_zh: '厄瓜多尔',
        key: 'EC',
        code: '593'
    },
    {
        name_en: 'Egypt',
        name_zh: '埃及',
        key: 'EG',
        code: '20'
    },
    {
        name_en: 'EI Salvador',
        name_zh: '萨尔瓦多',
        key: 'ES',
        code: '503'
    },
    {
        name_en: 'Estonia',
        name_zh: '爱沙尼亚',
        key: 'EE',
        code: '372'
    },
    {
        name_en: 'Ethiopia',
        name_zh: '埃塞俄比亚',
        key: 'ET',
        code: '251'
    },
    {
        name_en: 'Fiji',
        name_zh: '斐济',
        key: 'FJ',
        code: '679'
    },
    {
        name_en: 'Finland',
        name_zh: '芬兰',
        key: 'FI',
        code: '358'
    },
    {
        name_en: 'France',
        name_zh: '法国',
        key: 'FR',
        code: '33'
    },
    {
        name_en: 'French Guiana',
        name_zh: '法属圭亚那',
        key: 'GF',
        code: '594'
    },
    {
        name_en: 'Gabon',
        name_zh: '加蓬',
        key: 'GA',
        code: '241'
    },
    {
        name_en: 'Gambia',
        name_zh: '冈比亚',
        key: 'GM',
        code: '220'
    },
    {
        name_en: 'Georgia',
        name_zh: '格鲁吉亚',
        key: 'GE',
        code: '995'
    },
    {
        name_en: 'Germany',
        name_zh: '德国',
        key: 'DE',
        code: '49'
    },
    {
        name_en: 'Ghana',
        name_zh: '加纳',
        key: 'GH',
        code: '233'
    },
    {
        name_en: 'Gibraltar',
        name_zh: '直布罗陀',
        key: 'GI',
        code: '350'
    },
    {
        name_en: 'Greece',
        name_zh: '希腊',
        key: 'GR',
        code: '30'
    },
    {
        name_en: 'Grenada',
        name_zh: '格林纳达',
        key: 'GD',
        code: '1473'
    },
    {
        name_en: 'Guam',
        name_zh: '关岛',
        key: 'GU',
        code: '1671'
    },
    {
        name_en: 'Guatemala',
        name_zh: '危地马拉',
        key: 'GT',
        code: '502'
    },
    {
        name_en: 'Guinea',
        name_zh: '几内亚',
        key: 'GN',
        code: '224'
    },
    {
        name_en: 'Guyana',
        name_zh: '圭亚那',
        key: 'GY',
        code: '592'
    },
    {
        name_en: 'Haiti',
        name_zh: '海地',
        key: 'HT',
        code: '509'
    },
    {
        name_en: 'Honduras',
        name_zh: '洪都拉斯',
        key: 'HN',
        code: '504'
    },
    {
        name_en: 'Hong Kong',
        name_zh: '香港',
        key: 'HK',
        code: '852'
    },
    {
        name_en: 'Hungary',
        name_zh: '匈牙利',
        key: 'HU',
        code: '36'
    },
    {
        name_en: 'Iceland',
        name_zh: '冰岛',
        key: 'IS',
        code: '354'
    },
    {
        name_en: 'India',
        name_zh: '印度',
        key: 'IN',
        code: '91'
    },
    {
        name_en: 'Indonesia',
        name_zh: '印度尼西亚',
        key: 'ID',
        code: '62'
    },
    {
        name_en: 'Iran',
        name_zh: '伊朗',
        key: 'IR',
        code: '98'
    },
    {
        name_en: 'Iraq',
        name_zh: '伊拉克',
        key: 'IQ',
        code: '964'
    },
    {
        name_en: 'Ireland',
        name_zh: '爱尔兰',
        key: 'IE',
        code: '353'
    },
    {
        name_en: 'Israel',
        name_zh: '以色列',
        key: 'IL',
        code: '972'
    },
    {
        name_en: 'Italy',
        name_zh: '意大利',
        key: 'IT',
        code: '39'
    },
    {
        name_en: 'Ivory Coast',
        name_zh: '科特迪瓦',
        key: 'CI',
        code: '225'
    },
    {
        name_en: 'Jamaica',
        name_zh: '牙买加',
        key: 'JM',
        code: '1876'
    },
    {
        name_en: 'Japan',
        name_zh: '日本',
        key: 'JP',
        code: '81'
    },
    {
        name_en: 'Jordan',
        name_zh: '约旦',
        key: 'JO',
        code: '962'
    },
    {
        name_en: 'Kampuchea (Cambodia )',
        name_zh: '柬埔寨',
        key: 'KAM',
        code: '855'
    },
    {
        name_en: 'Kazakstan',
        name_zh: '哈萨克斯坦',
        key: 'KAZ',
        code: '327'
    },
    {
        name_en: 'Kenya',
        name_zh: '肯尼亚',
        key: 'KE',
        code: '254'
    },
    {
        name_en: 'Korea',
        name_zh: '韩国',
        key: 'KOR',
        code: '82'
    },
    {
        name_en: 'Kuwait',
        name_zh: '科威特',
        key: 'KW',
        code: '965'
    },
    {
        name_en: 'Kyrgyzstan',
        name_zh: '吉尔吉斯坦',
        key: 'KG',
        code: '996'
    },
    {
        name_en: 'Laos',
        name_zh: '老挝',
        key: 'LA',
        code: '856'
    },
    {
        name_en: 'Latvia',
        name_zh: '拉脱维亚',
        key: 'LV',
        code: '371'
    },
    {
        name_en: 'Lebanon',
        name_zh: '黎巴嫩',
        key: 'LB',
        code: '961'
    },
    {
        name_en: 'Lesotho',
        name_zh: '莱索托',
        key: 'LS',
        code: '266'
    },
    {
        name_en: 'Liberia',
        name_zh: '利比里亚',
        key: 'LR',
        code: '231'
    },
    {
        name_en: 'Libya',
        name_zh: '利比亚',
        key: 'LY',
        code: '218'
    },
    {
        name_en: 'Liechtenstein',
        name_zh: '列支敦士登',
        key: 'LI',
        code: '423'
    },
    {
        name_en: 'Lithuania',
        name_zh: '立陶宛',
        key: 'LT',
        code: '370'
    },
    {
        name_en: 'Luxembourg',
        name_zh: '卢森堡',
        key: 'LU',
        code: '352'
    },
    {
        name_en: 'Macau',
        name_zh: '澳门',
        key: 'MO',
        code: '853'
    },
    {
        name_en: 'Madagascar',
        name_zh: '马达加斯加',
        key: 'MG',
        code: '261'
    },
    {
        name_en: 'Malawi',
        name_zh: '马拉维',
        key: 'MW',
        code: '265'
    },
    {
        name_en: 'Malaysia',
        name_zh: '马来西亚',
        key: 'MY',
        code: '60'
    },
    {
        name_en: 'Maldives',
        name_zh: '马尔代夫',
        key: 'MV',
        code: '960'
    },
    {
        name_en: 'Mali',
        name_zh: '马里',
        key: 'ML',
        code: '223'
    },
    {
        name_en: 'Malta',
        name_zh: '马耳他',
        key: 'MT',
        code: '356'
    },
    {
        name_en: 'Mariana Is',
        name_zh: '马里亚那群岛',
        key: 'MRI',
        code: '1670'
    },
    {
        name_en: 'Martinique',
        name_zh: '马提尼克',
        key: 'MTQ',
        code: '596'
    },
    {
        name_en: 'Mauritius',
        name_zh: '毛里求斯',
        key: 'MU',
        code: '230'
    },
    {
        name_en: 'Mexico',
        name_zh: '墨西哥',
        key: 'MX',
        code: '52'
    },
    {
        name_en: 'Moldova Republic of',
        name_zh: '摩尔多瓦',
        key: 'MD',
        code: '373'
    },
    {
        name_en: 'Monaco',
        name_zh: '摩纳哥',
        key: 'MC',
        code: '377'
    },
    {
        name_en: 'Mongolia',
        name_zh: '蒙古',
        key: 'MN',
        code: '976'
    },
    {
        name_en: 'Montserrat Is',
        name_zh: '蒙特塞拉特岛',
        key: 'MS',
        code: '1664'
    },
    {
        name_en: 'Morocco',
        name_zh: '摩洛哥',
        key: 'MA',
        code: '212'
    },
    {
        name_en: 'Mozambique',
        name_zh: '莫桑比克',
        key: 'MZ',
        code: '258'
    },
    {
        name_en: 'Namibia',
        name_zh: '纳米比亚',
        key: 'NAM',
        code: '264'
    },
    {
        name_en: 'Nauru',
        name_zh: '瑙鲁',
        key: 'NR',
        code: '674'
    },
    {
        name_en: 'Nepal',
        name_zh: '尼泊尔',
        key: 'NP',
        code: '977'
    },
    {
        name_en: 'Netheriands Antilles',
        name_zh: '荷属安的列斯',
        key: 'NA',
        code: '599'
    },
    {
        name_en: 'Netherlands',
        name_zh: '荷兰',
        key: 'NL',
        code: '31'
    },
    {
        name_en: 'New Zealand',
        name_zh: '新西兰',
        key: 'NZ',
        code: '64'
    },
    {
        name_en: 'Nicaragua',
        name_zh: '尼加拉瓜',
        key: 'NI',
        code: '505'
    },
    {
        name_en: 'Niger',
        name_zh: '尼日尔',
        key: 'NE',
        code: '227'
    },
    {
        name_en: 'Nigeria',
        name_zh: '尼日利亚',
        key: 'NG',
        code: '234'
    },
    {
        name_en: 'North Korea',
        name_zh: '朝鲜',
        key: 'NK',
        code: '850'
    },
    {
        name_en: 'Norway',
        name_zh: '挪威',
        key: 'NW',
        code: '47'
    },
    {
        name_en: 'Oman',
        name_zh: '阿曼',
        key: 'OM',
        code: '968'
    },
    {
        name_en: 'Pakistan',
        name_zh: '巴基斯坦',
        key: 'PK',
        code: '92'
    },
    {
        name_en: 'Panama',
        name_zh: '巴拿马',
        key: 'PA',
        code: '507'
    },
    {
        name_en: 'Papua New Guinea',
        name_zh: '巴布亚新几内亚',
        key: 'PG',
        code: '675'
    },
    {
        name_en: 'Paraguay',
        name_zh: '巴拉圭',
        key: 'PY',
        code: '595'
    },
    {
        name_en: 'Peru',
        name_zh: '秘鲁',
        key: 'PE',
        code: '51'
    },
    {
        name_en: 'Philippines',
        name_zh: '菲律宾',
        key: 'PH',
        code: '63'
    },
    {
        name_en: 'Poland',
        name_zh: '波兰',
        key: 'PL',
        code: '48'
    },
    {
        name_en: 'French Polynesia',
        name_zh: '法属玻利尼西亚',
        key: 'PF',
        code: '689'
    },
    {
        name_en: 'Portugal',
        name_zh: '葡萄牙',
        key: 'PT',
        code: '351'
    },
    {
        name_en: 'Puerto Rico',
        name_zh: '波多黎各',
        key: 'PR',
        code: '1787'
    },
    {
        name_en: 'Qatar',
        name_zh: '卡塔尔',
        key: 'QA',
        code: '974'
    },
    {
        name_en: 'Reunion',
        name_zh: '留尼旺',
        key: 'RE',
        code: '262'
    },
    {
        name_en: 'Romania',
        name_zh: '罗马尼亚',
        key: 'RO',
        code: '40'
    },
    {
        name_en: 'Russia',
        name_zh: '俄罗斯',
        key: 'RU',
        code: '7'
    },
    {
        name_en: 'Saint Lucia',
        name_zh: '圣卢西亚',
        key: 'LC',
        code: '1758'
    },
    {
        name_en: 'Saint Vincent',
        name_zh: '圣文森特岛',
        key: 'VC',
        code: '1784'
    },
    {
        name_en: 'Samoa Eastern',
        name_zh: '东萨摩亚(美)',
        key: 'SE',
        code: '684'
    },
    {
        name_en: 'Samoa Western',
        name_zh: '西萨摩亚',
        key: 'SW',
        code: '685'
    },
    {
        name_en: 'San Marino',
        name_zh: '圣马力诺',
        key: 'SM',
        code: '378'
    },
    {
        name_en: 'Sao Tome and Principe',
        name_zh: '圣多美和普林西比',
        key: 'ST',
        code: '239'
    },
    {
        name_en: 'Saudi Arabia',
        name_zh: '沙特阿拉伯',
        key: 'SA',
        code: '966'
    },
    {
        name_en: 'Senegal',
        name_zh: '塞内加尔',
        key: 'SN',
        code: '221'
    },
    {
        name_en: 'Seychelles',
        name_zh: '塞舌尔',
        key: 'SC',
        code: '248'
    },
    {
        name_en: 'Sierra Leone',
        name_zh: '塞拉利昂',
        key: 'SL',
        code: '232'
    },
    {
        name_en: 'Singapore',
        name_zh: '新加坡',
        key: 'SG',
        code: '65'
    },
    {
        name_en: 'Slovakia',
        name_zh: '斯洛伐克',
        key: 'SK',
        code: '421'
    },
    {
        name_en: 'Slovenia',
        name_zh: '斯洛文尼亚',
        key: 'SI',
        code: '386'
    },
    {
        name_en: 'Solomon Is',
        name_zh: '所罗门群岛',
        key: 'SB',
        code: '677'
    },
    {
        name_en: 'Somalia',
        name_zh: '索马里',
        key: 'SO',
        code: '252'
    },
    {
        name_en: 'South Africa',
        name_zh: '南非',
        key: 'ZA',
        code: '27'
    },
    {
        name_en: 'Spain',
        name_zh: '西班牙',
        key: 'SPA',
        code: '34'
    },
    {
        name_en: 'Sri Lanka',
        name_zh: '斯里兰卡',
        key: 'LK',
        code: '94'
    },
    {
        name_en: 'St.Lucia',
        name_zh: '圣卢西亚',
        key: 'STL',
        code: '1758'
    },
    {
        name_en: 'St.Vincent',
        name_zh: '圣文森特',
        key: 'SV',
        code: '1784'
    },
    {
        name_en: 'Sudan',
        name_zh: '苏丹',
        key: 'SD',
        code: '249'
    },
    {
        name_en: 'Suriname',
        name_zh: '苏里南',
        key: 'SR',
        code: '597'
    },
    {
        name_en: 'Swaziland',
        name_zh: '斯威士兰',
        key: 'SZ',
        code: '268'
    },
    {
        name_en: 'Sweden',
        name_zh: '瑞典',
        key: 'SWE',
        code: '46'
    },
    {
        name_en: 'Switzerland',
        name_zh: '瑞士',
        key: 'SWL',
        code: '41'
    },
    {
        name_en: 'Syria',
        name_zh: '叙利亚',
        key: 'SY',
        code: '963'
    },
    {
        name_en: 'Taiwan',
        name_zh: '台湾省',
        key: 'TW',
        code: '886'
    },
    {
        name_en: 'Tajikistan',
        name_zh: '塔吉克斯坦',
        key: 'TJ',
        code: '992'
    },
    {
        name_en: 'Tanzania',
        name_zh: '坦桑尼亚',
        key: 'TZ',
        code: '255'
    },
    {
        name_en: 'Thailand',
        name_zh: '泰国',
        key: 'TH',
        code: '66'
    },
    {
        name_en: 'Togo',
        name_zh: '多哥',
        key: 'TG',
        code: '228'
    },
    {
        name_en: 'Tonga',
        name_zh: '汤加',
        key: 'TO',
        code: '676'
    },
    {
        name_en: 'Trinidadand Tobago',
        name_zh: '特立尼达和多巴哥',
        key: 'TT',
        code: '1868'
    },
    {
        name_en: 'Tunisia',
        name_zh: '突尼斯',
        key: 'TN',
        code: '216'
    },
    {
        name_en: 'Turkey',
        name_zh: '土耳其',
        key: 'TR',
        code: '90'
    },
    {
        name_en: 'Turkmenistan',
        name_zh: '土库曼斯坦',
        key: 'TM',
        code: '993'
    },
    {
        name_en: 'Uganda',
        name_zh: '乌干达',
        key: 'UG',
        code: '256'
    },
    {
        name_en: 'Ukraine',
        name_zh: '乌克兰',
        key: 'UA',
        code: '380'
    },
    {
        name_en: 'United Arab Emirates',
        name_zh: '阿拉伯联合酋长国',
        key: 'AE',
        code: '971'
    },
    {
        name_en: 'United Kingdom',
        name_zh: '英国',
        key: 'GB',
        code: '44'
    },
    {
        name_en: 'United States',
        name_zh: '美国',
        key: 'US',
        code: '1'
    },
    {
        name_en: 'Uruguay',
        name_zh: '乌拉圭',
        key: 'UY',
        code: '598'
    },
    {
        name_en: 'Uzbekistan',
        name_zh: '乌兹别克斯坦',
        key: 'UZ',
        code: '998'
    },
    {
        name_en: 'Venezuela',
        name_zh: '委内瑞拉',
        key: 'VE',
        code: '58'
    },
    {
        name_en: 'Vietnam',
        name_zh: '越南',
        key: 'VN',
        code: '84'
    },
    {
        name_en: 'Yemen',
        name_zh: '也门',
        key: 'YE',
        code: '967'
    },
    {
        name_en: 'Yugoslavia',
        name_zh: '南斯拉夫',
        key: 'YUG',
        code: '381'
    },
    {
        name_en: 'Zaire',
        name_zh: '扎伊尔',
        key: 'ZMI',
        code: '243'
    },
    {
        name_en: 'Zambia',
        name_zh: '赞比亚',
        key: 'ZMB',
        code: '260'
    },
    {
        name_en: 'Zimbabwe',
        name_zh: '津巴布韦',
        key: 'ZW',
        code: '263'
    }
]

export default arealist
