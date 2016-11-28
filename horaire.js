
var interact = require("interact.js");
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import FontIcon from 'material-ui/FontIcon';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';


class Horaire extends React.Component {

  constructor() {
    super();
    this.state = {
      counter : 0,
      disposBox : [],
      isMounted : false,
      hourHeight : 14,
      hours : [7,7.5,8,8.5,9,9.5,10,10.5,11,11.5,12,12.5,13,13.5,14,14.5,15,15.5,16,16.5,17,17.5,18,18.5,19,19.5,20,20.5,21,21.5,22,22.5],
      dispos : [],
      index : 0,
      days : [1,2,3,4,5,6,7],
      disposBoxShow : [],
      disposShow : []
    };
  }

  componentDidMount() {
    // console.log('dipsos', this.props.dispos, _.pluck(this.props.dispos, 'box'))

    if(typeof this.props.dispos !== 'undefined') {
      this.setDispos()
      // this.setState({
      //   isMounted : true,
      //   disposBox : _.pluck(this.props.dispos, 'box'),
      //   dispos: this.props.dispos,
      //   counter: this.props.dispos.length
      // }, () => {
      //   this.state.dispos.map((d,i)=>{
      //     var elm = document.getElementById(d.box);
      //     // log.info("ELM", elm)
      //     var debut = d.debut - 7;
      //     elm.style.marginTop = (debut * 2 * this.state.hourHeight) + "px";
      //     elm.style.height = ((d.fin - d.debut) * this.state.hourHeight * 2) + 1 + "px";
      //     elm.style.marginLeft = (d.jour * document.querySelector(".jour").getBoundingClientRect().width) + "px";
      //     // log.info("ELM after", elm)
      //   })
      // });
    } else {
      this.setState({
        isMounted : true
      });
    }

    if(this.props.disposDisplay !== null) {
      this.setDisposDisplay()
    }

    if(this.props.days !== undefined && this.props.days.length > 0) {
      this.setState({
        days : this.props.days.map((d,i)=>{
          return d+1;
        }).sort()
      })
    } else {
      this.setState({
        days: [1,2,3,4,5,6,7]
      })
    }

  }

  componentDidUpdate(prevProps, prevState) {
    if(!_.isEqual(prevProps.dispos,this.props.dispos)) {
      this.forceUpdate()
      this.setDispos()
    }

    if( !_.isEqual(prevProps.disposDisplay,this.props.disposDisplay) ||
        !_.isEqual(prevState.days,this.state.days)) {
      if(this.props.disposDisplay !== null) {
        this.setDisposDisplay()
      }
    }


    if(this.props.days !== undefined && this.props.days.length > 0) {
      if(!_.isEqual(prevProps.days,this.props.days)) {
        this.setState({
          days : this.props.days.map((d,i)=>{
            return d+1;
          }).sort()
        })
      }
    } else {
      if(!_.isEqual(prevProps.days,this.props.days)) {
        this.setState({
          days: [1,2,3,4,5,6,7]
        })
      }
    }

  }

  setDispos() {
    this.setState({
      isMounted : true,
      disposBox : _.pluck(this.props.dispos, 'box'),
      dispos: this.props.dispos,
      counter: this.props.dispos.length
    }, () => {
      this.state.dispos.map((d,i)=>{
        var elm = document.getElementById(d.box);
        // log.info("ELM", elm)
        var debut = d.debut - 7;
        elm.style.marginTop = (debut * 2 * this.state.hourHeight) + "px";
        elm.style.height = ((d.fin - d.debut) * this.state.hourHeight * 2) + 1 + "px";
        elm.style.marginLeft = (d.jour * document.querySelector(".jour").getBoundingClientRect().width) + "px";
        // log.info("ELM after", elm)
      })
    });
  }

  setDisposDisplay() {
    const dispos = _.filter(this.props.disposDisplay, (dis)=> this.state.days.indexOf(dis.jour) > -1 )
    console.log("DISPOS!!", dispos, this.state.days)
    this.setState({
      isMounted : true,
      disposBoxShow : dispos.map((dis,i)=> {
        return "b" + i
      }),
      disposShow: dispos.map((dis,i)=> {
        dis.box = "b" + i;
        return dis
      }),
      counter: dispos.length
    }, () => {
      this.state.disposShow.map((d,i)=>{
        var elm = document.getElementById(d.box);
        var debut = d.debut - 7;
        elm.style.marginTop = (debut * 2 * this.state.hourHeight) + "px";
        elm.style.height = ((d.fin - d.debut) * this.state.hourHeight * 2) + 1 + "px";
        elm.style.marginLeft = (this.state.days.sort().indexOf(d.jour) * document.querySelector(".jour").getBoundingClientRect().width) + "px";
      })
    });
  }

  _saveDispo(id, left, top, height, width) {

    var dispo = _.findWhere(this.state.dispos, { box : id });
    var jIndex = Math.round(left / width);
    if(this.state.days !== undefined && this.state.days.length > 0) {
      jIndex = this.state.days[jIndex] - 1;
    }
    var infos = {
      box : id,
      debut : Math.floor(top / this.state.hourHeight) / 2 + 7,
      fin : (top + height)/ this.state.hourHeight / 2 + 7,
      jour : jIndex
    };

    for (var i = 0; i < this.state.dispos.length; i++) {
      if(!_.contains(this.state.disposBox, this.state.dispos[i].box)) {
        this.setState({
          dispos : [...this.state.dispos.slice(0,i),...this.state.dispos.slice(i+1)]
        })
      }
    }

    if(_.isUndefined(dispo)) {
      this.state.dispos.push(infos);
      this.setState({
        dispos : this.state.dispos
      }, function(){
        this.props.onChange(this.state.dispos);
      });

    } else {
      var index = _.indexOf(this.state.dispos, dispo);
      if(!_.isEqual(this.state.dispos, infos)) {
        this.state.dispos[index] = infos;
        this.setState({
          dispos : this.state.dispos
        }, function(){
          // console.log("new dispos saved 2", this.state.dispos);
          this.props.onChange(this.state.dispos);
        });
      }
    }

  }

  _forceResize(event, boxWidth) {
    var target = event.target;

    var boxHeight = this.state.hourHeight;

    var marginTop = parseFloat(target.style.marginTop);
    var marginLeft = parseFloat(target.style.marginLeft);

    var rec = target.getBoundingClientRect();
    var maxHeight =  boxHeight * this.state.hours.length - marginTop;
    var newHeight = target.offsetHeight % boxHeight;
    var calculatedHeight = (newHeight > boxHeight/2 ? target.offsetHeight + (boxHeight - newHeight) : target.offsetHeight - newHeight);
    target.style.height = (maxHeight < calculatedHeight ? maxHeight : calculatedHeight) + 'px';

    var leftDistance = marginLeft % boxWidth;
    var margin = (leftDistance < (boxWidth / 2) ? marginLeft - leftDistance : marginLeft + (boxWidth - leftDistance) );
    target.style.marginLeft = margin + "px";

    this._saveDispo(target.id, marginLeft, marginTop, parseFloat(target.style.height), boxWidth);

  }



  render () {

    var boxHeight = this.state.hourHeight;
    var hours = this.state.hours;
    var jours = ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.'];
    var minHeight = Math.ceil(this.props.duree / 60) * boxHeight * 2;
    var $this = this;

    if(this.state.isMounted){

      var boxWidth = document.querySelector(".jour").getBoundingClientRect().width;

      var x=0, y=0;
      interact('.dispo')
      .draggable({
        snap: {
          targets: [
            interact.createSnapGrid({ x: boxWidth / 5, y: boxHeight })
          ]
        },
        inertia: false,
        onstart : function(event){
          x = parseFloat(event.target.style.marginLeft);
          y = parseFloat(event.target.style.marginTop) ;
        },
        onmove : function (event) {
          x += !isNaN(event.dx) ? parseFloat(event.dx) : 0;
          y += parseFloat(event.dy);
          event.target.style.margin =
              (y > -(boxHeight+2) ? y : boxHeight) + 'px 0 0 ' + (x > 0 ? (x > boxWidth * 6 ? boxWidth * 6 : x ) : 0) + 'px';
        },
        onend : function (event) {
          $this._forceResize(event, boxWidth);
        }
      })
      .resizable({
        preserveAspectRatio: false,
        edges: { left: false, right: false, bottom: true, top: false },
        onmove : function (event) {
            var target = event.target,
            y = (parseFloat(target.getAttribute('data-y')) || boxHeight);
            target.style.height = (event.rect.height > minHeight ? event.rect.height : minHeight) + 'px';
            target.setAttribute('data-y', y);
        },
        onend :  function (event) {
          $this._forceResize(event, boxWidth);
        }
      });

  }



    return (

      <div>


        <div className="toolbar">

              <button
                style={{ marginTop : 8, marginBottom: 8 }}
                onTouchTap={()=>{
                  this.state.disposBox.push('box' + this.state.counter++);
                  this.setState({
                    disposBox : this.state.disposBox,
                    counter : this.state.counter++
                  });
                }} > {t("Ajouter une disponibilité")} </button>

              <br/>

              <DatePicker
                fullWidth={true}
                autoOk={true}
                hintText="Date début"
                container='inline'
                onChange={ (nullData, date)=>{ this.props.onStartChange(date.toISOString()); }}
                shouldDisableDate={ (date) => {
                  return date < new Date();
                }} />

              <DatePicker
                fullWidth={true}
                autoOk={true}
                hintText="Date fin"
                container='inline'
                onChange={ (nullData, date)=>{ this.props.onEndChange(date.toISOString()); }}
                shouldDisableDate={ (date) => {
                  return date < new Date();
                }} />

        </div>

        {this.props.disposDisplay &&
          <div className="demande-note">
            {this.props.message}
          </div>
        }

        <div className="horaire-container" style={{ height: (hours.length + 1) * boxHeight }}>

          <div className="horaire">

            <div className="dispo-container">
              {this.state.disposBox.map((dispo,i)=>{

              return (
                <div key={dispo} id={dispo} className="dispo" data-length={this.state.days.length} style={{ margin : 0  }}>
                  <div className="supprimer"><FontIcon className="material-icons" style={{ color: '#fff', fontSize : 12 }} onTouchTap={(event) => {
                    event.persist()
                    var e2 = event;
                    // console.log('event', event)
                    this.setState({
                      disposBox : _.without(this.state.disposBox, dispo),
                      counter : this.state.counter--,
                      dispos : _.without(this.state.dispos, _.findWhere(this.state.dispos, { box : dispo }))
                    }, () => {
                      this.props.onChange(this.state.dispos);
                    });
                    }}>close</FontIcon></div>
                  <div className="disponibilite"></div>
                </div>
                );

              })}

              {this.state.disposBoxShow.map((dispo,i)=>{
                return (
                  <div key={dispo} id={dispo} className="dispo-light" data-length={this.state.days.length} style={{ margin : 0  }}>
                    <div className="disponibilite"></div>
                  </div>
                );
              })}
            </div>


            {this.state.days.map((day,i) => {
              return( <div key={day} className="jour" data-length={this.state.days.length} >

                <div className="jour-label">{jours[day-1]}</div>

                {hours.map((hour,i) => {

                return (
                  <div key={i}>
                    <div className="heure-label">
                      <If test={day==this.state.days[0] && hour % 1 === 0}>
                        <div>{hour}h</div>
                      </If>
                    </div>
                    <div className={"heure" + (hour % 1 === 0 ? " odd" : "")} id={i === hours.length - 1 ? "boxTarget" : "" } style={{ height : boxHeight }} ></div>
                  </div>
                  );

                })}

              </div> );

            })}

          </div>
        </div>

      </div>
    );
  }
}

export default Horaire;
